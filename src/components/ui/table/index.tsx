import { ScrollArea } from "@base-ui/react/scroll-area"
import {
	createColumnHelper,
	createSortedRowModel,
	rowSortingFeature,
	sortFn_alphanumeric,
	tableFeatures,
	useTable
} from "@tanstack/react-table"
import type { RowData } from "@tanstack/react-table"
import type { ReactNode } from "react"
import { useMemo } from "react"
import styles from "./table.module.css"

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric }
})

export type TableColumn<TData extends RowData> = {
	id: string
	header: ReactNode
	accessor: (row: TData) => unknown
	cell?: (value: unknown, row: TData) => ReactNode
	rowHeader?: boolean
	width?: "entity" | "number" | "date" | "fluid"
	tone?: "default" | "muted" | "accent"
}

export function Table<TData extends RowData>({
	columns,
	data,
	label,
	search,
	summary
}: {
	columns: TableColumn<TData>[]
	data: TData[]
	label: string
	search?: string
	summary?: ReactNode
}) {
	const tableColumns = useMemo(() => {
		const columnHelper = createColumnHelper<typeof features, TData>()
		return columnHelper.columns(
			columns.map((column) =>
				columnHelper.accessor((row) => column.accessor(row), {
					id: column.id,
					header: () => column.header,
					sortFn: "alphanumeric",
					cell: (info) =>
						column.cell
							? column.cell(info.getValue(), info.row.original)
							: String(info.getValue())
				})
			)
		)
	}, [columns])

	const filteredData = useMemo(() => {
		const query = search?.trim().toLowerCase()

		if (!query) {
			return data
		}

		return data.filter((row) =>
			columns.some((column) =>
				String(column.accessor(row)).toLowerCase().includes(query)
			)
		)
	}, [columns, data, search])

	const table = useTable(
		{
			features,
			columns: tableColumns,
			data: filteredData
		},
		(state) => ({ sorting: state.sorting })
	)

	return (
		<div className={styles.panel}>
			{summary ? <div className={styles.summary}>{summary}</div> : null}
			<ScrollArea.Root className={styles.scrollRoot}>
				<ScrollArea.Viewport className={styles.viewport}>
					<ScrollArea.Content className={styles.scrollContent}>
						<table className={styles.table} aria-label={label}>
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map(
											(header, index) => (
												<th
													className={cellClass(
														columns[index]
													)}
													key={header.id}
												>
													{header.isPlaceholder ? null : (
														<button
															className={
																styles.sortButton
															}
															onClick={header.column.getToggleSortingHandler()}
															type="button"
														>
															<table.FlexRender
																header={header}
															/>
															<span
																className={
																	styles.sortIndicator
																}
															>
																{header.column.getIsSorted() ===
																"asc"
																	? "↑"
																	: null}
																{header.column.getIsSorted() ===
																"desc"
																	? "↓"
																	: null}
															</span>
														</button>
													)}
												</th>
											)
										)}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr key={row.id}>
										{row
											.getAllCells()
											.map((cell, index) => {
												const column = columns[index]
												const className =
													cellClass(column)
												return column.rowHeader ? (
													<th
														className={className}
														key={cell.id}
														scope="row"
													>
														<table.FlexRender
															cell={cell}
														/>
													</th>
												) : (
													<td
														className={className}
														key={cell.id}
													>
														<table.FlexRender
															cell={cell}
														/>
													</td>
												)
											})}
									</tr>
								))}
							</tbody>
						</table>
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className={styles.scrollbar}
					keepMounted
					orientation="vertical"
				>
					<ScrollArea.Thumb className={styles.thumb} />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className={styles.corner} />
			</ScrollArea.Root>
		</div>
	)
}

function cellClass<TData extends RowData>(column: TableColumn<TData>) {
	return [
		styles.cell,
		column.width ? styles[column.width] : styles.fluid,
		column.tone ? styles[column.tone] : styles.default
	].join(" ")
}
