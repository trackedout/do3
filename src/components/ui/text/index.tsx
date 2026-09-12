import type { ReactNode } from "react"
import styles from "./text.module.css"

export function MarkerLabel({
	children,
	marker
}: {
	children: ReactNode
	marker?: ReactNode
}) {
	return (
		<span className={styles.markerLabel}>
			<span className={styles.marker}>{marker}</span>
			{children}
		</span>
	)
}

export function Muted({ children }: { children: ReactNode }) {
	return <span className={styles.muted}>{children}</span>
}

export function TextLink({
	children,
	href = "/"
}: {
	children: ReactNode
	href?: string
}) {
	return (
		<a className={styles.link} href={href}>
			{children}
		</a>
	)
}

export function Highlight({ children }: { children: ReactNode }) {
	return <mark className={styles.highlight}>{children}</mark>
}
