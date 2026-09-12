export const uploadHaste = async (
	content: string,
	userAgent: string,
	type = "md",
	url = "https://hst.sh"
) => {
	const response = await fetch(`${url}/documents`, {
		method: "POST",
		body: content,
		headers: {
			"User-Agent": userAgent
		}
	})

	if (!response.ok) throw new Error("Failed to upload haste")

	const data = (await response.json()) as { key: string }
	return `${url}/${data.key}.${type}`
}
