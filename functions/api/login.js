export async function onRequestPost(context) {
  const { password } = await context.request.json();
  const expected = context.env.ADMIN_PASSWORD;

  if (!expected) {
    return Response.json({ ok: false, error: "Admin password is not configured." }, { status: 500 });
  }

  if (password !== expected) {
    return Response.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "admin_session=1; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800",
    },
  });
}
