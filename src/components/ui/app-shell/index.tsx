import type { ReactNode } from "react"
import styles from "./app-shell.module.css"

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<main className={styles.shell} id="main">
			{children}
		</main>
	)
}

export function AppContent({ children }: { children: ReactNode }) {
	return <section className={styles.content}>{children}</section>
}
