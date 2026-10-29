const BASE = "/api";

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",           // <-- critical
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export const api = {
  get: (p) => req(p),
  post: (p, data) => req(p, { method: "POST", body: JSON.stringify(data || {}) }),
  put: (p, data) => req(p, { method: "PUT", body: JSON.stringify(data || {}) }),
  del: (p) => req(p, { method: "DELETE" }),
};