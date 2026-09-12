CREATE TABLE `discord_videos` (
	`channel_id` text NOT NULL,
	`video_id` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discord_videos_channel_video_unique` ON `discord_videos` (`channel_id`,`video_id`);