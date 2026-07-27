/**
 * Cloudflare Worker stub for deskzy.xyz short-link redirects.
 * Deploy with wrangler; point to KV populated by Go API write path.
 */
export interface Env {
  LINKS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const code = url.pathname.replace(/^\/+/, "").split("/")[0];
    if (!code || code === "healthz") {
      return new Response("deskzy redirect worker", { status: 200 });
    }
    const dest = await env.LINKS.get(code);
    if (!dest) return new Response("Not found", { status: 404 });
    return Response.redirect(dest, 302);
  },
};
