import { useSpoilerMode } from "~/hooks/useSpoilerMode"
import { Button } from "~/components/ui/button"

export function SpoilerModeButton() {
	const { spoilerMode, toggleSpoilerMode } = useSpoilerMode()

	return (
		<Button
			intent={spoilerMode ? "warning" : "disabled"}
			width="lg"
			aria-pressed={spoilerMode}
			onClick={toggleSpoilerMode}
		>
			Spoiler mode: {spoilerMode ? "On" : "Off"}
		</Button>
	)
}
