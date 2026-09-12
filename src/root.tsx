import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData
} from "react-router"
import {
	getSpoilerModeFromCookie,
	SpoilerModeProvider
} from "~/hooks/useSpoilerMode"
import "./globals.css"

export function loader({ request }: { request: Request }) {
	return {
		spoilerMode: getSpoilerModeFromCookie(
			request.headers.get("cookie") ?? ""
		)
	}
}

export function meta() {
	return [
		{ title: "Buape Template" },
		{ name: "description", content: "A React Router template." }
	]
}

export default function Root() {
	const loaderData = useLoaderData<typeof loader>()
	const [queryClient] = useState(() => new QueryClient())

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="preload"
					href="/fonts/advent-pro-700.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/lexend-300.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/lexend-500.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/lexend-700.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<SpoilerModeProvider
						initialSpoilerMode={loaderData.spoilerMode}
					>
						<Outlet />
					</SpoilerModeProvider>
				</QueryClientProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
