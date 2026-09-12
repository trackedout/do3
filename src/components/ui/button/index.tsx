import {
	Button as BaseButton,
	type ButtonProps as BaseButtonProps
} from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import styles from "./button.module.css"

const buttonClass = cva(styles.button, {
	variants: {
		intent: {
			quiet: styles.quiet,
			active: styles.active,
			warning: styles.warning,
			muted: styles.muted,
			disabled: styles.disabled
		},
		width: {
			md: styles.md,
			lg: styles.lg
		}
	},
	defaultVariants: {
		intent: "quiet",
		width: "md"
	}
})

export function Button({
	className,
	intent,
	width,
	...props
}: BaseButtonProps & VariantProps<typeof buttonClass>) {
	return (
		<BaseButton
			className={buttonClass({ className, intent, width })}
			{...props}
		/>
	)
}
