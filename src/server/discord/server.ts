import { Client } from "@buape/carbon"
import { createHandler } from "@buape/carbon/adapters/fetch"
import { LatestVideoCommand } from "./commands/latest-video"
import { PingCommand } from "./commands/ping"

let client: Client | null = null
let handler: ReturnType<typeof createHandler> | null = null

export const handleDiscordRequest = async (
	request: Request,
	env: Cloudflare.Env,
	ctx: ExecutionContext
) => {
	const token = env.DISCORD_BOT_TOKEN ?? env.DISCORD_TOKEN
	if (!token) {
		return new Response("Missing DISCORD_BOT_TOKEN or DISCORD_TOKEN", {
			status: 500
		})
	}

	const url = new URL(request.url)
	if (url.pathname === "/api/discord") {
		if (request.method === "POST") {
			url.pathname = "/api/discord/interactions"
			request = new Request(url.toString(), request)
		} else {
			return Response.json({ ok: true })
		}
	}

	return await getDiscordHandler(env)(request, ctx)
}

export const getDiscordClient = (env: Cloudflare.Env) => {
	const token = env.DISCORD_BOT_TOKEN ?? env.DISCORD_TOKEN
	if (!token) throw new Error("Missing DISCORD_BOT_TOKEN or DISCORD_TOKEN")

	if (!client) {
		const options = {
			baseUrl:
				env.DISCORD_BASE_URL ??
				env.BASE_URL ??
				"https://do3.trackedout.org/api/discord",
			token,
			deploySecret: "do3"
		}

		if (env.DISCORD_CLIENT_ID) {
			Object.assign(options, { clientId: env.DISCORD_CLIENT_ID })
		}
		if (env.DISCORD_PUBLIC_KEY) {
			Object.assign(options, { publicKey: env.DISCORD_PUBLIC_KEY })
		}

		client = new Client(options, {
			commands: [new PingCommand(), new LatestVideoCommand()]
		})
	}

	return client
}

const getDiscordHandler = (env: Cloudflare.Env) => {
	if (!handler) handler = createHandler(getDiscordClient(env))
	return handler
}
