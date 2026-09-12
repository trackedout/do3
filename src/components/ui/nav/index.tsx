import { cva, type VariantProps } from "class-variance-authority"
import styles from "./nav.module.css"

const navClass = cva(styles.item, {
	variants: {
		size: {
			sm: styles.sm,
			md: styles.md,
			lg: styles.lg,
			xl: styles.xl
		},
		active: {
			true: styles.active,
			false: styles.inactive
		}
	},
	defaultVariants: {
		size: "lg",
		active: false
	}
})

type NavItem = VariantProps<typeof navClass> & {
	label: string
	suffix?: string
	href?: string
}

export function Nav({ items }: { items: NavItem[] }) {
	return (
		<nav className={styles.nav} aria-label="Primary navigation">
			{items.map((item) => (
				<a
					aria-current={item.active ? "page" : undefined}
					className={navClass({
						active: item.active,
						size: item.size
					})}
					href={item.href ?? "/"}
					key={item.label}
				>
					{item.label}
					{item.suffix ? <sup>{item.suffix}</sup> : null}
				</a>
			))}
		</nav>
	)
}
