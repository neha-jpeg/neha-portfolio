const STORAGE_KEY = "portfolio-content";

export async function fetchContent() {
  try {
    const response = await fetch("/api/content", { credentials: "include" });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // API unavailable in local dev without Pages Functions
  }

  try {
    const response = await fetch("/content.json");
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // ignore
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore invalid JSON
    }
  }

  return null;
}

export async function saveContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));

  try {
    const response = await fetch("/api/content", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (response.ok) {
      return { ok: true, persisted: true };
    }
    if (response.status === 401) {
      return { ok: false, error: "Not authorized. Log in again." };
    }
    if (response.status === 503) {
      return { ok: true, persisted: false, warning: "Saved on this device only. Connect Cloudflare KV for live updates." };
    }
    const data = await response.json().catch(() => ({}));
    return { ok: false, error: data.error || "Could not save to server." };
  } catch {
    return { ok: true, persisted: false, warning: "Saved on this device only. Deploy with Cloudflare KV for live updates." };
  }
}

export async function checkSession() {
  try {
    const response = await fetch("/api/session", { credentials: "include" });
    if (response.ok) {
      const data = await response.json();
      return Boolean(data.isAdmin);
    }
  } catch {
    // fall through to dev session
  }
  return sessionStorage.getItem("portfolio-admin") === "true";
}

export async function login(password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      sessionStorage.setItem("portfolio-admin", "true");
      return { ok: true };
    }
  } catch {
    // dev fallback below
  }

  const devPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  if (devPassword && password === devPassword) {
    sessionStorage.setItem("portfolio-admin", "true");
    return { ok: true };
  }

  return { ok: false, error: "Incorrect password." };
}

export async function logout() {
  sessionStorage.removeItem("portfolio-admin");
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
  } catch {
    // ignore
  }
}
