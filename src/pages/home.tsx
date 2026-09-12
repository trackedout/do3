import { MCHead } from "~/components/MCHead"
import { AppContent, AppShell } from "~/components/ui/app-shell"
import { Button } from "~/components/ui/button"
import { Nav } from "~/components/ui/nav"
import { SearchField } from "~/components/ui/search-field"
import { SpoilerModeButton } from "~/components/ui/spoiler-mode-button"
import { Table, type TableColumn } from "~/components/ui/table"
import { Highlight, MarkerLabel, Muted, TextLink } from "~/components/ui/text"
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

const runs = [
	{
		hermit: "Grian",
		run: "9.2",
		episode: "HC11 E45",
		vod: "None",
		observed: "Tango VOD 9/12",
		date: new Date("2026-12-09T00:00:00")
	},
	{
		hermit: "Grian",
		run: "9.3",
		episode: "HC11 E45",
		vod: "None",
		observed: "Tango VOD 9/12",
		date: new Date("2026-12-09T00:00:00")
	},
	{
		hermit: "Grian",
		run: "9.4",
		episode: "None",
		vod: "None",
		observed: "Tango VOD 9/12",
		date: new Date("2026-12-09T00:00:00")
	},
	{
		hermit: "TangoTek",
		run: "10.1",
		episode: "HC11 E46",
		vod: "Tango VOD 9/13",
		observed: "Etho VOD 9/13",
		date: new Date("2026-12-10T00:00:00")
	},
	{
		hermit: "Etho",
		run: "10.2",
		episode: "HC11 E47",
		vod: "None",
		observed: "Tango VOD 9/14",
		date: new Date("2026-12-11T00:00:00")
	},
	{
		hermit: "PearlescentMoon",
		run: "10.3",
		episode: "HC11 E47",
		vod: "Pearl VOD 9/14",
		observed: "Tango VOD 9/14",
		date: new Date("2026-12-12T00:00:00")
	},
	{
		hermit: "ImpulseSV",
		run: "10.4",
		episode: "HC11 E48",
		vod: "Impulse VOD 9/15",
		observed: "Skizz VOD 9/15",
		date: new Date("2026-12-13T00:00:00")
	},
	{
		hermit: "MumboJumbo",
		run: "10.5",
		episode: "HC11 E48",
		vod: "None",
		observed: "Tango VOD 9/15",
		date: new Date("2026-12-14T00:00:00")
	},
	{
		hermit: "Xisuma",
		run: "10.6",
		episode: "None",
		vod: "Xisuma VOD 9/16",
		observed: "Tango VOD 9/16",
		date: new Date("2026-12-15T00:00:00")
	},
	{
		hermit: "Keralis",
		run: "10.7",
		episode: "HC11 E49",
		vod: "None",
		observed: "Tango VOD 9/16",
		date: new Date("2026-12-16T00:00:00")
	},
	{
		hermit: "Docm77",
		run: "10.8",
		episode: "HC11 E49",
		vod: "Doc VOD 9/17",
		observed: "Tango VOD 9/17",
		date: new Date("2026-12-17T00:00:00")
	},
	{
		hermit: "ZombieCleo",
		run: "10.9",
		episode: "HC11 E50",
		vod: "None",
		observed: "Cleo VOD 9/17",
		date: new Date("2026-12-18T00:00:00")
	},
	{
		hermit: "FalseSymmetry",
		run: "11.1",
		episode: "HC11 E50",
		vod: "False VOD 9/18",
		observed: "Tango VOD 9/18",
		date: new Date("2026-12-19T00:00:00")
	},
	{
		hermit: "GeminiTay",
		run: "11.2",
		episode: "HC11 E51",
		vod: "None",
		observed: "Gem VOD 9/18",
		date: new Date("2026-12-20T00:00:00")
	},
	{
		hermit: "Zedaph",
		run: "11.3",
		episode: "None",
		vod: "Zedaph VOD 9/19",
		observed: "Tango VOD 9/19",
		date: new Date("2026-12-21T00:00:00")
	},
	{
		hermit: "BdoubleO100",
		run: "11.4",
		episode: "HC11 E51",
		vod: "Bdubs VOD 9/19",
		observed: "Tango VOD 9/19",
		date: new Date("2026-12-22T00:00:00")
	},
	{
		hermit: "Cubfan135",
		run: "11.5",
		episode: "HC11 E52",
		vod: "None",
		observed: "Cub VOD 9/20",
		date: new Date("2026-12-23T00:00:00")
	},
	{
		hermit: "Rendog",
		run: "11.6",
		episode: "HC11 E52",
		vod: "Ren VOD 9/20",
		observed: "Tango VOD 9/20",
		date: new Date("2026-12-24T00:00:00")
	},
	{
		hermit: "GoodTimesWithScar",
		run: "11.7",
		episode: "None",
		vod: "Scar VOD 9/21",
		observed: "Tango VOD 9/21",
		date: new Date("2026-12-25T00:00:00")
	},
	{
		hermit: "Hypnotizd",
		run: "11.8",
		episode: "HC11 E53",
		vod: "Hypno VOD 9/21",
		observed: "Tango VOD 9/21",
		date: new Date("2026-12-26T00:00:00")
	},
	{
		hermit: "JoeHills",
		run: "11.9",
		episode: "HC11 E53",
		vod: "None",
		observed: "Joe VOD 9/22",
		date: new Date("2026-12-27T00:00:00")
	},
	{
		hermit: "Welsknight",
		run: "12.1",
		episode: "HC11 E54",
		vod: "Wels VOD 9/22",
		observed: "Tango VOD 9/22",
		date: new Date("2026-12-28T00:00:00")
	},
	{
		hermit: "iJevin",
		run: "12.2",
		episode: "None",
		vod: "None",
		observed: "Jevin VOD 9/23",
		date: new Date("2026-12-29T00:00:00")
	},
	{
		hermit: "VintageBeef",
		run: "12.3",
		episode: "HC11 E54",
		vod: "Beef VOD 9/23",
		observed: "Tango VOD 9/23",
		date: new Date("2026-12-30T00:00:00")
	},
	{
		hermit: "xBCrafted",
		run: "12.4",
		episode: "HC11 E55",
		vod: "None",
		observed: "xB VOD 9/24",
		date: new Date("2026-12-31T00:00:00")
	},
	{
		hermit: "Smallishbeans",
		run: "12.5",
		episode: "HC11 E55",
		vod: "Joel VOD 9/24",
		observed: "Tango VOD 9/24",
		date: new Date("2027-01-01T00:00:00")
	},
	{
		hermit: "Grian",
		run: "12.6",
		episode: "HC11 E56",
		vod: "None",
		observed: "Tango VOD 9/25",
		date: new Date("2027-01-02T00:00:00")
	},
	{
		hermit: "TangoTek",
		run: "12.7",
		episode: "None",
		vod: "Tango VOD 9/25",
		observed: "Etho VOD 9/25",
		date: new Date("2027-01-03T00:00:00")
	},
	{
		hermit: "Etho",
		run: "12.8",
		episode: "HC11 E56",
		vod: "Etho VOD 9/26",
		observed: "Tango VOD 9/26",
		date: new Date("2027-01-04T00:00:00")
	},
	{
		hermit: "PearlescentMoon",
		run: "12.9",
		episode: "HC11 E57",
		vod: "None",
		observed: "Pearl VOD 9/26",
		date: new Date("2027-01-05T00:00:00")
	},
	{
		hermit: "ImpulseSV",
		run: "13.1",
		episode: "HC11 E57",
		vod: "Impulse VOD 9/27",
		observed: "Tango VOD 9/27",
		date: new Date("2027-01-06T00:00:00")
	},
	{
		hermit: "MumboJumbo",
		run: "13.2",
		episode: "None",
		vod: "None",
		observed: "Tango VOD 9/27",
		date: new Date("2027-01-07T00:00:00")
	},
	{
		hermit: "GeminiTay",
		run: "13.3",
		episode: "HC11 E58",
		vod: "Gem VOD 9/28",
		observed: "Tango VOD 9/28",
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
		id: "episode",
		header: "Episode",
		accessor: (row: (typeof runs)[number]) => row.episode,
		cell: (value: unknown) =>
			value === "None" ? (
				<Muted>None</Muted>
			) : (
				<TextLink>{String(value)}</TextLink>
			)
	},
	{
		id: "vod",
		header: "VOD",
		accessor: (row: (typeof runs)[number]) => row.vod,
		cell: (value: unknown) => <Muted>{String(value)}</Muted>
	},
	{
		id: "observed",
		header: "Observed",
		accessor: (row: (typeof runs)[number]) => row.observed,
		cell: (value: unknown) => <TextLink>{String(value)}</TextLink>
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
