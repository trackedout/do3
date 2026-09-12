import { Container, MediaGallery, Separator, TextDisplay } from "@buape/carbon"
import type { Video } from "../youtube"

export class HermitVideo extends Container {
	constructor(data: Video) {
		super(
			[
				new TextDisplay(
					`## ${data.title}\nhttps://youtu.be/${data.videoId}`
				),
				new MediaGallery([
					{
						url: data.thumbnail,
						description: data.title
					}
				]),
				new Separator({ spacing: "small" }),
				new TextDisplay(
					`Uploaded at <t:${Math.floor(data.timestamp.getTime() / 1000)}:F>`
				)
			],
			{ accentColor: "#d4a95f" }
		)
	}
}
