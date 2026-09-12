import { MCHead } from "~/components/MCHead"
import { AppContent, AppShell } from "~/components/ui/app-shell"
import { Button } from "~/components/ui/button"
import { Nav } from "~/components/ui/nav"
import { SearchField } from "~/components/ui/search-field"
import { SpoilerModeButton } from "~/components/ui/spoiler-mode-button"
import { Table, type TableColumn } from "~/components/ui/table"
import {
	BrokenTextLink,
	Highlight,
	MarkerLabel,
	Muted,
	TextLink
} from "~/components/ui/text"
import { useState } from "react"
import { Toolbar } from "~/components/ui/toolbar"
import { TopBar } from "~/components/ui/top-bar"
import { useSpoilerMode } from "~/hooks/useSpoilerMode"

const compassUrl = "/assets/brand/compass.png"
const menuUrl = "/assets/icons/menu.svg"
const searchUrl = "/assets/icons/search.svg"
const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric"
})

const navItems = [
	{ label: "Teams", active: false, size: "sm" },
	{ label: "Artifakes", suffix: "TM", active: false, size: "md" },
	{ label: "Overview", active: false, size: "lg" },
	{ label: "Viewer’s Guide", active: true, size: "xl" },
	{ label: "Runs", active: false, size: "lg" },
	{ label: "Decks", active: false, size: "md" },
	{ label: "Kills", active: false, size: "sm" }
] as const

type RunSource =
	| { label: string; href: string; state: "linked" }
	| { label: string; state: "notFound" }

const runs: {
	hermit: string
	run: string
	video: RunSource | null
	vod: RunSource | null
	observed: RunSource | null
	date: Date
}[] = [
	{
		hermit: "Grian",
		run: "9.2",
		video: { label: "HC11 E45", state: "notFound" },
		vod: null,
		observed: { label: "Tango VOD 9/12", state: "notFound" },
		date: new Date("2026-12-09T00:00:00")
	},
	{
		hermit: "Grian",
		run: "9.3",
		video: { label: "HC11 E45", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/12", href: "/", state: "linked" },
		date: new Date("2026-12-09T00:00:00")
	},
	{
		hermit: "Grian",
		run: "9.4",
		video: null,
		vod: null,
		observed: { label: "Tango VOD 9/12", href: "/", state: "linked" },
		date: new Date("2026-12-09T00:00:00")
	},
	{
		hermit: "TangoTek",
		run: "10.1",
		video: { label: "HC11 E46", href: "/", state: "linked" },
		vod: { label: "Tango VOD 9/13", state: "notFound" },
		observed: null,
		date: new Date("2026-12-10T00:00:00")
	},
	{
		hermit: "Etho",
		run: "10.2",
		video: { label: "HC11 E47", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/14", href: "/", state: "linked" },
		date: new Date("2026-12-11T00:00:00")
	},
	{
		hermit: "PearlescentMoon",
		run: "10.3",
		video: { label: "HC11 E47", href: "/", state: "linked" },
		vod: { label: "Pearl VOD 9/14", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/14", href: "/", state: "linked" },
		date: new Date("2026-12-12T00:00:00")
	},
	{
		hermit: "ImpulseSV",
		run: "10.4",
		video: { label: "HC11 E48", href: "/", state: "linked" },
		vod: { label: "Impulse VOD 9/15", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/15", href: "/", state: "linked" },
		date: new Date("2026-12-13T00:00:00")
	},
	{
		hermit: "MumboJumbo",
		run: "10.5",
		video: { label: "HC11 E48", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/15", href: "/", state: "linked" },
		date: new Date("2026-12-14T00:00:00")
	},
	{
		hermit: "Xisuma",
		run: "10.6",
		video: null,
		vod: { label: "Xisuma VOD 9/16", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/16", href: "/", state: "linked" },
		date: new Date("2026-12-15T00:00:00")
	},
	{
		hermit: "Keralis",
		run: "10.7",
		video: { label: "HC11 E49", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/16", href: "/", state: "linked" },
		date: new Date("2026-12-16T00:00:00")
	},
	{
		hermit: "Docm77",
		run: "10.8",
		video: { label: "HC11 E49", href: "/", state: "linked" },
		vod: { label: "Doc VOD 9/17", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/17", href: "/", state: "linked" },
		date: new Date("2026-12-17T00:00:00")
	},
	{
		hermit: "ZombieCleo",
		run: "10.9",
		video: { label: "HC11 E50", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/17", href: "/", state: "linked" },
		date: new Date("2026-12-18T00:00:00")
	},
	{
		hermit: "FalseSymmetry",
		run: "11.1",
		video: { label: "HC11 E50", href: "/", state: "linked" },
		vod: { label: "False VOD 9/18", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/18", href: "/", state: "linked" },
		date: new Date("2026-12-19T00:00:00")
	},
	{
		hermit: "GeminiTay",
		run: "11.2",
		video: { label: "HC11 E51", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/18", href: "/", state: "linked" },
		date: new Date("2026-12-20T00:00:00")
	},
	{
		hermit: "Zedaph",
		run: "11.3",
		video: null,
		vod: { label: "Zedaph VOD 9/19", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/19", href: "/", state: "linked" },
		date: new Date("2026-12-21T00:00:00")
	},
	{
		hermit: "BdoubleO100",
		run: "11.4",
		video: { label: "HC11 E51", href: "/", state: "linked" },
		vod: { label: "Bdubs VOD 9/19", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/19", href: "/", state: "linked" },
		date: new Date("2026-12-22T00:00:00")
	},
	{
		hermit: "Cubfan135",
		run: "11.5",
		video: { label: "HC11 E52", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/20", href: "/", state: "linked" },
		date: new Date("2026-12-23T00:00:00")
	},
	{
		hermit: "Rendog",
		run: "11.6",
		video: { label: "HC11 E52", href: "/", state: "linked" },
		vod: { label: "Ren VOD 9/20", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/20", href: "/", state: "linked" },
		date: new Date("2026-12-24T00:00:00")
	},
	{
		hermit: "GoodTimesWithScar",
		run: "11.7",
		video: null,
		vod: { label: "Scar VOD 9/21", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/21", href: "/", state: "linked" },
		date: new Date("2026-12-25T00:00:00")
	},
	{
		hermit: "Hypnotizd",
		run: "11.8",
		video: { label: "HC11 E53", href: "/", state: "linked" },
		vod: { label: "Hypno VOD 9/21", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/21", href: "/", state: "linked" },
		date: new Date("2026-12-26T00:00:00")
	},
	{
		hermit: "JoeHills",
		run: "11.9",
		video: { label: "HC11 E53", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/22", href: "/", state: "linked" },
		date: new Date("2026-12-27T00:00:00")
	},
	{
		hermit: "Welsknight",
		run: "12.1",
		video: { label: "HC11 E54", href: "/", state: "linked" },
		vod: { label: "Wels VOD 9/22", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/22", href: "/", state: "linked" },
		date: new Date("2026-12-28T00:00:00")
	},
	{
		hermit: "iJevin",
		run: "12.2",
		video: null,
		vod: null,
		observed: { label: "Tango VOD 9/23", href: "/", state: "linked" },
		date: new Date("2026-12-29T00:00:00")
	},
	{
		hermit: "VintageBeef",
		run: "12.3",
		video: { label: "HC11 E54", href: "/", state: "linked" },
		vod: { label: "Beef VOD 9/23", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/23", href: "/", state: "linked" },
		date: new Date("2026-12-30T00:00:00")
	},
	{
		hermit: "xBCrafted",
		run: "12.4",
		video: { label: "HC11 E55", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/24", href: "/", state: "linked" },
		date: new Date("2026-12-31T00:00:00")
	},
	{
		hermit: "Smallishbeans",
		run: "12.5",
		video: { label: "HC11 E55", href: "/", state: "linked" },
		vod: { label: "Joel VOD 9/24", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/24", href: "/", state: "linked" },
		date: new Date("2027-01-01T00:00:00")
	},
	{
		hermit: "Grian",
		run: "12.6",
		video: { label: "HC11 E56", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/25", href: "/", state: "linked" },
		date: new Date("2027-01-02T00:00:00")
	},
	{
		hermit: "TangoTek",
		run: "12.7",
		video: null,
		vod: { label: "Tango VOD 9/25", href: "/", state: "linked" },
		observed: null,
		date: new Date("2027-01-03T00:00:00")
	},
	{
		hermit: "Etho",
		run: "12.8",
		video: { label: "HC11 E56", href: "/", state: "linked" },
		vod: { label: "Etho VOD 9/26", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/26", href: "/", state: "linked" },
		date: new Date("2027-01-04T00:00:00")
	},
	{
		hermit: "PearlescentMoon",
		run: "12.9",
		video: { label: "HC11 E57", href: "/", state: "linked" },
		vod: null,
		observed: { label: "Tango VOD 9/26", href: "/", state: "linked" },
		date: new Date("2027-01-05T00:00:00")
	},
	{
		hermit: "ImpulseSV",
		run: "13.1",
		video: { label: "HC11 E57", href: "/", state: "linked" },
		vod: { label: "Impulse VOD 9/27", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/27", href: "/", state: "linked" },
		date: new Date("2027-01-06T00:00:00")
	},
	{
		hermit: "MumboJumbo",
		run: "13.2",
		video: null,
		vod: null,
		observed: { label: "Tango VOD 9/27", href: "/", state: "linked" },
		date: new Date("2027-01-07T00:00:00")
	},
	{
		hermit: "GeminiTay",
		run: "13.3",
		video: { label: "HC11 E58", href: "/", state: "linked" },
		vod: { label: "Gem VOD 9/28", href: "/", state: "linked" },
		observed: { label: "Tango VOD 9/28", href: "/", state: "linked" },
		date: new Date("2027-01-08T00:00:00")
	}
]

const columns = [
	{
		id: "hermit",
		header: "Hermit",
		accessor: (row: (typeof runs)[number]) => row.hermit,
		cell: (value: unknown) => (
			<MarkerLabel marker={<MCHead name={String(value)} />}>
				{String(value)}
			</MarkerLabel>
		),
		rowHeader: true,
		width: "entity"
	},
	{
		id: "run",
		header: "Run",
		accessor: (row: (typeof runs)[number]) => row.run,
		width: "number"
	},
	{
		id: "video",
		header: "Video",
		accessor: (row: (typeof runs)[number]) => row.video?.label ?? "None",
		cell: (_value: unknown, row) =>
			row.video ? (
				row.video.state === "notFound" ? (
					<BrokenTextLink>{row.video.label}</BrokenTextLink>
				) : (
					<TextLink href={row.video.href}>{row.video.label}</TextLink>
				)
			) : (
				<Muted>None</Muted>
			)
	},
	{
		id: "vod",
		header: "VOD",
		accessor: (row: (typeof runs)[number]) => row.vod?.label ?? "None",
		cell: (_value: unknown, row) =>
			row.vod ? (
				row.vod.state === "notFound" ? (
					<BrokenTextLink>{row.vod.label}</BrokenTextLink>
				) : (
					<TextLink href={row.vod.href}>{row.vod.label}</TextLink>
				)
			) : (
				<Muted>None</Muted>
			)
	},
	{
		id: "observed",
		header: "Observed",
		accessor: (row: (typeof runs)[number]) => row.observed?.label ?? "None",
		cell: (_value: unknown, row) =>
			row.observed ? (
				row.observed.state === "notFound" ? (
					<BrokenTextLink>{row.observed.label}</BrokenTextLink>
				) : (
					<TextLink href={row.observed.href}>
						{row.observed.label}
					</TextLink>
				)
			) : (
				<Muted>None</Muted>
			)
	},
	{
		id: "date",
		header: "Date",
		accessor: (row: (typeof runs)[number]) => row.date,
		cell: (value: unknown) =>
			value instanceof Date ? dateFormatter.format(value) : String(value),
		width: "date"
	}
] satisfies TableColumn<(typeof runs)[number]>[]

export function meta() {
	return [
		{ title: "The Dungeon Archive — Viewer’s Guide" },
		{
			name: "description",
			content: "Viewer’s Guide for The Dungeon Archive."
		}
	]
}

export default function HomePage() {
	const { spoilerMode } = useSpoilerMode()
	const [search, setSearch] = useState("")

	return (
		<AppShell>
			<TopBar
				logo={compassUrl}
				menuIcon={menuUrl}
				title="The dungeon archive"
			/>
			<Nav items={[...navItems]} />
			<AppContent>
				<Toolbar>
					<SearchField
						label="Search viewer guide"
						icon={searchUrl}
						onValueChange={setSearch}
						placeholder="Search..."
						value={search}
					/>
					<Button intent="active">Filter by</Button>
					<SpoilerModeButton />
				</Toolbar>
				<Table
					label="Viewer's guide"
					columns={columns}
					data={runs}
					search={search}
					summary={
						<>
							<strong>Filtered by:</strong>
							<span>
								Successful Runs
								{spoilerMode ? (
									<>
										{" "}
										<Highlight>(Spoilers)</Highlight>
									</>
								) : null}
							</span>
						</>
					}
				/>
			</AppContent>
		</AppShell>
	)
}
