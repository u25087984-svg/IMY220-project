import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function AdminPage() {
  const [reported, setReported] = useState([]);
  const [users, setUsers] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [newReason, setNewReason] = useState({ label: "", description: "" });
  const [error, setError] = useState("");

  async function load() {
    try {
      const [r, u, rr] = await Promise.all([
        api.get("/reports/admin/reported"),
        api.get("/admin/users"),
        api.get("/reports/reasons"),
      ]);
      setReported(r); setUsers(u); setReasons(rr);
    } catch (e) { setError(e.message); }
  }

  useEffect(() => { load(); }, []);

  async function deletePost(id) {
    await api.del(`/admin/posts/${id}`);
    load();
  }
  async function clearReports(id) {
    await api.del(`/reports/post/${id}/clear`);
    load();
  }
  async function deleteUser(username) {
    if (!confirm(`Delete ${username}?`)) return;
    await api.del(`/admin/users/${encodeURIComponent(username)}`);
    load();
  }
  async function addReason(e) {
    e.preventDefault();
    await api.post("/reports/reasons", newReason);
    setNewReason({ label: "", description: "" });
    load();
  }
  async function deleteReason(id) {
    await api.del(`/reports/reasons/${id}`);
    load();
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Admin</h1>
      {error && <p className="text-red-500">{error}</p>}

      <section>
        <h2 className="text-xl font-semibold">Reported posts</h2>
        {reported.length === 0 && <p>No reported posts.</p>}
        <ul className="space-y-3 mt-2">
          {reported.map((p) => (
            <li key={p.id} className="border p-3 rounded">
              <p><strong>{p.username}</strong>: {p.caption}</p>
              <p className="text-sm text-gray-600">
                {p.reports.length} report(s):
                {p.reports.map((r, i) => (
                  <span key={i}> [{r.reason} by {r.reporter}]</span>
                ))}
              </p>
              <div className="mt-2 space-x-2">
                <button onClick={() => deletePost(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete post</button>
                <button onClick={() => clearReports(p.id)} className="px-2 py-1 bg-gray-600 text-white rounded">Clear reports</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Users</h2>
        <ul className="space-y-2 mt-2">
          {users.map((u) => (
            <li key={u.id} className="flex justify-between border p-2 rounded">
              <span>{u.username} — {u.name} ({u.email}) [{u.role}]</span>
              <button onClick={() => deleteUser(u.username)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Report reasons</h2>
        <ul className="space-y-1 mt-2">
          {reasons.map((r) => (
            <li key={r.id} className="flex justify-between">
              <span>{r.label} — {r.description}</span>
              <button onClick={() => deleteReason(r.id)} className="text-red-600">Remove</button>
            </li>
          ))}
        </ul>
        <form onSubmit={addReason} className="mt-3 space-y-2">
          <input placeholder="Label" value={newReason.label}
            onChange={(e) => setNewReason({ ...newReason, label: e.target.value })}
            className="border p-2 rounded w-full" required />
          <input placeholder="Description" value={newReason.description}
            onChange={(e) => setNewReason({ ...newReason, description: e.target.value })}
            className="border p-2 rounded w-full" />
          <button className="bg-black text-white px-3 py-1 rounded">Add reason</button>
        </form>
      </section>
    </div>
  );
}