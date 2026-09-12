import {
	integer,
	sqliteTable,
	text,
	uniqueIndex
} from "drizzle-orm/sqlite-core"

export const discordVideos = sqliteTable(
	"discord_videos",
	{
		channelId: text("channel_id").notNull(),
		videoId: text("video_id").notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => [
		uniqueIndex("discord_videos_channel_video_unique").on(
			table.channelId,
			table.videoId
		)
	]
)
