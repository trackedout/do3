import { createRequestHandler } from "react-router"
import { api } from "~/server/api"
import { handleDiscordRequest } from "~/server/discord/server"
import { checkYoutube } from "~/server/discord/scheduled"

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE
)

export default {
	fetch(request, env, ctx) {
		const pathname = new URL(request.url).pathname

		if (
			pathname === "/api/discord" ||
			pathname.startsWith("/api/discord/")
		) {
			return handleDiscordRequest(request, env, ctx)
		}

		if (pathname === "/api" || pathname.startsWith("/api/")) {
			return api.fetch(request, env, ctx)
		}

		return requestHandler(request)
	},
	scheduled(_controller, env, ctx) {
		ctx.waitUntil(checkYoutube(env))
	}
} satisfies ExportedHandler<Cloudflare.Env>
