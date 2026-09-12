import { Input as BaseInput, type InputProps } from "@base-ui/react/input"
import styles from "./search-field.module.css"

export function SearchField({
	icon,
	label,
	...props
}: InputProps & { icon?: string; label: string }) {
	return (
		<label className={styles.search}>
			<span className="sr-only">{label}</span>
			<BaseInput type="search" {...props} />
			{icon ? (
				<img
					className={styles.icon}
					src={icon}
					alt=""
					width="27"
					height="28"
				/>
			) : null}
		</label>
	)
}
