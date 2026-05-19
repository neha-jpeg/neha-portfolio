const KV_KEY = "portfolio-content";

function isAuthenticated(request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.includes("admin_session=1");
}

export async function onRequestGet(context) {
  const { env, request } = context;

  if (env.PORTFOLIO_KV) {
    const stored = await env.PORTFOLIO_KV.get(KV_KEY);
    if (stored) {
      return new Response(stored, {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const assetUrl = new URL("/content.json", request.url);
  if (env.ASSETS) {
    return env.ASSETS.fetch(assetUrl);
  }

  return Response.json({ error: "Content not found." }, { status: 404 });
}

export async function onRequestPut(context) {
  if (!isAuthenticated(context.request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!context.env.PORTFOLIO_KV) {
    return Response.json(
      { error: "KV storage is not configured. Bind PORTFOLIO_KV in Cloudflare." },
      { status: 503 },
    );
  }

  const content = await context.request.json();
  await context.env.PORTFOLIO_KV.put(KV_KEY, JSON.stringify(content));
  return Response.json({ ok: true });
}
