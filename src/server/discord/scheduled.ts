import { and, eq } from "drizzle-orm"
import { channels, roles, type ChannelType, type RoleType } from "./config"
import { getDiscordClient } from "./server"
import { hermits } from "./hermits"
import { HermitVideo } from "./premades/hermitVideo"
import { getLatestVideo, type Video } from "./youtube"
import { getDb } from "../db"
import { discordVideos } from "../db/schema"

export const checkYoutube = async (env: Cloudflare.Env) => {
	console.log(`Checking YouTube: ${new Date().toISOString()}`)

	const results = await Promise.allSettled(
		hermits.map(async (hermit) => {
			await checkChannel(env, hermit.channelId, hermit.name, "video")
			if (hermit.secondChannelId) {
				await checkChannel(
					env,
					hermit.secondChannelId,
					`${hermit.name} 2`,
					"vod"
				)
			}
		})
	)
	const failures = results.filter((result) => result.status === "rejected")

	if (failures.length) {
		console.error("YouTube check failures:", failures)
	}

	console.log(
		`Finished YouTube check: ${results.length - failures.length}/${results.length} hermits checked`
	)
}

const checkChannel = async (
	env: Cloudflare.Env,
	channelId: string,
	name: string,
	type: RoleType
) => {
	const db = getDb(env.DB)
	const video = await getLatestVideo(channelId)
	const existing = await db
		.select()
		.from(discordVideos)
		.where(
			and(
				eq(discordVideos.channelId, channelId),
				eq(discordVideos.videoId, video.videoId)
			)
		)
		.get()

	if (existing) {
		console.log("No new video:", name)
		return
	}

	console.log(`New video for ${name}`, video)
	await db.insert(discordVideos).values({
		channelId,
		videoId: video.videoId
	})
	await sendAlert(
		env,
		video,
		type,
		video.description.includes("Stream Chat") ? "stream" : type
	)
}

const sendAlert = async (
	env: Cloudflare.Env,
	video: Video,
	type: RoleType,
	channelType: ChannelType
) => {
	const channel = await getDiscordClient(env).fetchChannel(
		channels[channelType]
	)
	if (!channel || !("send" in channel)) throw new Error("Channel not found")

	await channel.send({
		content: `<@&${roles[type]}> from ${video.author}`,
		embeds: [new HermitVideo(video)]
	})
}
