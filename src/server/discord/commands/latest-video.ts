import {
	ApplicationCommandOptionType,
	Command,
	type AutocompleteInteraction,
	type CommandInteraction,
	type CommandOptions
} from "@buape/carbon"
import { hermits } from "../hermits"
import { HermitVideo } from "../premades/hermitVideo"
import { uploadHaste } from "../utils"
import { getLatestVideo, getLatestVideoRaw } from "../youtube"

export class LatestVideoCommand extends Command {
	name = "latest-video"
	description = "Get the latest video from a Hermitcraft member"
	options: CommandOptions = [
		{
			type: ApplicationCommandOptionType.String,
			name: "hermit",
			description: "The Hermit to get the latest video from",
			required: true,
			autocomplete: async (interaction: AutocompleteInteraction) => {
				const currentValue =
					interaction.options?.getString("hermit") ?? ""
				const options = hermits
					.filter((hermit) =>
						currentValue
							? hermit.name
									.toLowerCase()
									.includes(currentValue.toLowerCase())
							: true
					)
					.map((hermit) => ({
						name: hermit.name,
						value: hermit.name
					}))

				return await interaction.respond(options.slice(0, 25))
			}
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: "second-channel",
			description:
				"Do you want to get the latest video from the Hermit's second channel?",
			required: false
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: "raw",
			description: "Do you want the raw data?",
			required: false
		}
	]

	override async run(interaction: CommandInteraction) {
		const hermitName = interaction.options.getString("hermit", true)
		const secondChannel =
			interaction.options.getBoolean("second-channel") ?? false
		const raw = interaction.options.getBoolean("raw") ?? false
		const hermit = hermits.find((hermit) => hermit.name === hermitName)

		if (!hermit)
			return interaction.reply(`**${hermitName}** is not a hermit!`)
		if (secondChannel && !hermit.secondChannelId) {
			return interaction.reply(
				`**${hermit.name}** doesn't have a second channel!`
			)
		}

		const channelId = secondChannel
			? hermit.secondChannelId
			: hermit.channelId
		if (!channelId)
			return interaction.reply("No channel found for that hermit.")

		if (raw) {
			const rawData = await getLatestVideoRaw(channelId)
			const haste = await uploadHaste(
				rawData,
				"Tracked Out https://trackedout.org",
				"xml",
				"https://hst.sh"
			)

			return interaction.reply(haste)
		}

		const data = await getLatestVideo(channelId)
		return interaction.reply({
			content: `Here is the latest video from **${hermit.name}${
				secondChannel ? "'s** second channel!" : "**"
			}!`,
			embeds: [new HermitVideo(data)]
		})
	}
}
