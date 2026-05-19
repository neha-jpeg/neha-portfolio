function isAuthenticated(request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.includes("admin_session=1");
}

export async function onRequestGet(context) {
  return Response.json({ isAdmin: isAuthenticated(context.request) });
}
