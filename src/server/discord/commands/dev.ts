import {
	ApplicationCommandOptionType,
	Command,
	type AutocompleteInteraction,
	type CommandInteraction,
	type CommandOptions,
	CommandWithSubcommandGroups,
	CommandWithSubcommands,
	InteractionResponseType
} from "@buape/carbon"
import { checkYoutube, sendAlert } from "../scheduled"
import { hermits } from "../hermits"
import { getLatestVideo } from "../youtube"

const devUserId = "439223656200273932"

abstract class DevCommand extends Command {
	override async preCheck(interaction: CommandInteraction) {
		if (interaction.userId === devUserId) return true

		await interaction.reply({
			content:
				"This command is only available to Tracked Out developers.",
			ephemeral: true
		})
		return false
	}
}

class SyncCommand extends DevCommand {
	name = "sync"
	description = "Run the YouTube video sync now"

	constructor(private env: Cloudflare.Env) {
		super()
	}

	override async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: "YouTube sync started.",
			ephemeral: true
		})
		await checkYoutube(this.env)
		await interaction.followUp({
			content: "YouTube sync finished.",
			ephemeral: true
		})
	}
}

class RepingCommand extends DevCommand {
	name = "reping"
	description = "Send a video alert again"
	options: CommandOptions = [
		{
			type: ApplicationCommandOptionType.String,
			name: "video",
			description: "The channel to reping",
			required: true,
			autocomplete: async (interaction: AutocompleteInteraction) => {
				const currentValue =
					interaction.options?.getString("video") ?? ""
				const options = videoOptions
					.filter((option) =>
						currentValue
							? option.name
									.toLowerCase()
									.includes(currentValue.toLowerCase())
							: true
					)
					.map((option) => ({
						name: option.name,
						value: option.value
					}))

				return await interaction.respond(options.slice(0, 25))
			}
		}
	]

	constructor(private env: Cloudflare.Env) {
		super()
	}

	override async run(interaction: CommandInteraction) {
		const selected = videoOptions.find(
			(option) =>
				option.value === interaction.options.getString("video", true)
		)

		if (!selected) {
			return interaction.reply({
				content: "Unknown video channel.",
				ephemeral: true
			})
		}

		const video = await getLatestVideo(selected.channelId)
		await sendAlert(
			this.env,
			video,
			selected.type,
			video.description.includes("Stream Chat") ? "stream" : selected.type
		)
		return interaction.reply({
			content: `Repinged ${selected.name}.`,
			ephemeral: true
		})
	}
}

class ActivityCommand extends DevCommand {
	name = "activity"
	description = "Launch the Discord activity"

	override async run(interaction: CommandInteraction) {
		const response = await fetch(
			`https://discord.com/api/v10/interactions/${interaction.rawData.id}/${interaction.rawData.token}/callback`,
			{
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					type: InteractionResponseType.LaunchActivity
				})
			}
		)

		if (!response.ok) {
			throw new Error(`Failed to launch activity: ${response.status}`)
		}
	}
}

class VideoCommand extends CommandWithSubcommands {
	name = "video"
	description = "Video dev tools"

	constructor(env: Cloudflare.Env) {
		super()
		this.subcommands = [new SyncCommand(env), new RepingCommand(env)]
	}

	subcommands: Command[]
}

export class DevCommandGroup extends CommandWithSubcommandGroups {
	name = "dev"
	description = "Tracked Out developer tools"

	constructor(env: Cloudflare.Env) {
		super()
		this.subcommandGroups = [new VideoCommand(env)]
		this.subcommands = [new ActivityCommand()]
	}

	subcommandGroups: CommandWithSubcommands[]
}

const videoOptions = hermits.flatMap((hermit) => [
	{
		name: `${hermit.name} (video)`,
		value: `${hermit.channelId}:video`,
		channelId: hermit.channelId,
		type: "video" as const
	},
	...(hermit.secondChannelId
		? [
				{
					name: `${hermit.name} 2 (vod)`,
					value: `${hermit.secondChannelId}:vod`,
					channelId: hermit.secondChannelId,
					type: "vod" as const
				}
			]
		: [])
])
