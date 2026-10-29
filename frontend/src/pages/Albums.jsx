import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Albums() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", hashtags: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try { setAlbums(await api.get("/albums")); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const tags = form.hashtags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean)
        .map(t => t.startsWith("#") ? t : `#${t}`);
      await api.post("/albums", { name: form.name, description: form.description, hashtags: tags });
      setForm({ name: "", description: "", hashtags: "" });
      load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (!confirm("Delete this album?")) return;
    try { await api.del(`/albums/${id}`); load(); }
    catch (e) { setError(e.message); }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="font-display text-3xl">Albums</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={create} className="border border-border rounded-xl p-4 space-y-2 bg-surface">
        <h2 className="font-semibold">Create album</h2>
        <input placeholder="Album name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Hashtags (#travel #summer)" value={form.hashtags}
          onChange={(e) => setForm({ ...form, hashtags: e.target.value })} />
        <button disabled={busy} className="btn btn-primary">{busy ? "Creating…" : "Create"}</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((a) => (
          <div key={a.id} className="border border-border rounded-xl p-4 bg-surface">
            <Link to={`/albums/${a.id}`} className="font-semibold text-lg hover:text-accent">{a.name}</Link>
            <p className="text-sm text-muted">{a.username}</p>
            <p className="text-sm mt-1">{a.description}</p>
            <div className="flex flex-wrap gap-1 text-xs mt-2">
              {a.hashtags?.map((t, i) => (
                <Link key={i} to={`/search?q=${encodeURIComponent(t)}`} className="text-accent">{t}</Link>
              ))}
            </div>
            {a.username === user.username && (
              <button onClick={() => remove(a.id)} className="btn btn-ghost text-red-600 mt-3 text-sm">Delete</button>
            )}
          </div>
        ))}
        {albums.length === 0 && <p className="text-muted">No albums yet.</p>}
      </div>
    </div>
  );
}