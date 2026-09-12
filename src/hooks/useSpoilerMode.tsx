import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react"

const storageKey = "spoiler-mode"
const SpoilerModeContext = createContext<{
	setSpoilerMode: (spoilerMode: boolean) => void
	spoilerMode: boolean
	toggleSpoilerMode: () => void
} | null>(null)

export function getSpoilerModeFromCookie(cookie: string) {
	return !cookie.includes(`${storageKey}=off`)
}

export function SpoilerModeProvider({
	children,
	initialSpoilerMode
}: {
	children: ReactNode
	initialSpoilerMode: boolean
}) {
	const [spoilerMode, setSpoilerMode] = useState(initialSpoilerMode)

	useEffect(() => {
		localStorage.setItem(storageKey, spoilerMode ? "on" : "off")
		document.cookie = `${storageKey}=${spoilerMode ? "on" : "off"}; path=/; max-age=31536000; SameSite=Lax`
	}, [spoilerMode])

	const value = useMemo(
		() => ({
			spoilerMode,
			setSpoilerMode,
			toggleSpoilerMode: () => setSpoilerMode((enabled) => !enabled)
		}),
		[spoilerMode]
	)

	return (
		<SpoilerModeContext.Provider value={value}>
			{children}
		</SpoilerModeContext.Provider>
	)
}

export function useSpoilerMode() {
	const spoilerMode = useContext(SpoilerModeContext)

	if (!spoilerMode) {
		throw new Error(
			"useSpoilerMode must be used inside SpoilerModeProvider"
		)
	}

	return spoilerMode
}
