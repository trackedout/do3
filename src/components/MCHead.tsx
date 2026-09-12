export function MCHead({ name }: { name: string }) {
	return (
		<img
			src={`/api/head/${encodeURIComponent(name)}`}
			alt={`${name} Minecraft head`}
			width="32"
			height="32"
		/>
	)
}
