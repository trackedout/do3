export type Video = {
	videoId: string
	title: string
	author: string
	description: string
	thumbnail: string
	timestamp: Date
}

export const getLatestVideoRaw = async (channelId: string) => {
	const xml = await fetchFeed(channelId)
	return getTag(xml, "entry") ?? xml
}

export const getLatestVideo = async (channelId: string) => {
	const xml = await fetchFeed(channelId)
	const entry = getTag(xml, "entry")

	if (!entry) throw new Error(`No videos found for channel ${channelId}`)

	const videoId = getText(entry, "yt:videoId") ?? "No ID"

	return {
		videoId,
		title: getText(entry, "title") ?? "No Title",
		author:
			getText(getTag(entry, "author") ?? entry, "name") ?? "No Author",
		description:
			getText(
				getTag(entry, "media:group") ?? entry,
				"media:description"
			) ?? "No description",
		thumbnail: `https://i2.ytimg.com/vi/${videoId}/hqdefault.jpg`,
		timestamp: new Date(getText(entry, "published") ?? new Date())
	} satisfies Video
}

const fetchFeed = async (channelId: string) => {
	const response = await fetch(
		`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
	)

	if (!response.ok) throw new Error(`YouTube feed failed: ${response.status}`)

	return await response.text()
}

const getTag = (xml: string, tag: string) => {
	return new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(xml)?.[1]
}

const getText = (xml: string, tag: string) => {
	const value = getTag(xml, tag)
	if (!value) return null

	return value
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.trim()
}
