import { Button as BaseButton } from "@base-ui/react/button"
import styles from "./top-bar.module.css"

export function TopBar({
	logo,
	logoAlt = "",
	menuIcon,
	title
}: {
	logo: string
	logoAlt?: string
	menuIcon: string
	title: string
}) {
	return (
		<header className={styles.header}>
			<a className={styles.brand} href="/" aria-label={`${title} home`}>
				<img
					className={styles.logo}
					src={logo}
					alt={logoAlt}
					width="53"
					height="53"
				/>
				<span>{title}</span>
			</a>
			<BaseButton className={styles.iconButton} aria-label="Open menu">
				<img
					className={styles.menuIcon}
					src={menuIcon}
					alt=""
					width="46"
					height="32"
				/>
			</BaseButton>
		</header>
	)
}
