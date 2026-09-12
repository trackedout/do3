import { Embed } from "@buape/carbon"
import type { Video } from "../youtube"

export class HermitVideo extends Embed {
	constructor(data: Video) {
		super({
			title: data.title,
			url: `https://youtu.be/${data.videoId}`,
			image: {
				url: data.thumbnail
			},
			footer: {
				text: "Uploaded at"
			},
			timestamp: data.timestamp.toISOString()
		})
	}
}
