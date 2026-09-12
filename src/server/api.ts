import { Hono } from "hono"

export const api = new Hono<{ Bindings: Cloudflare.Env }>()

api.get("/api", (c) => c.json({ data: { ok: true } }))

api.get("/api/head/:name", async (c) => {
	const name = c.req.param("name")
	const response = await fetch(
		`https://heads.discordsrv.com/${encodeURIComponent(name)}/helm`
	)

	if (!response.ok) {
		return c.json(
			{ error: { message: "head not found" } },
			response.status === 404 ? 404 : 502
		)
	}

	return new Response(response.body, {
		headers: {
			"cache-control": "public, max-age=86400",
			"content-type": response.headers.get("content-type") ?? "image/png"
		}
	})
})

api.notFound((c) => c.json({ error: { message: "not found" } }, 404))
