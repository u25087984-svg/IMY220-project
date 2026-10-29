import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AlbumPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [album, setAlbum] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", hashtags: "" });
  const [error, setError] = useState("");

  async function load() {
    try {
      const a = await api.get(`/albums/${id}`);
      setAlbum(a);
      setForm({ name: a.name, description: a.description, hashtags: (a.hashtags || []).join(" ") });
      setAllPosts(await api.get("/posts"));
    } catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function saveEdit(e) {
    e.preventDefault();
    try {
      const tags = form.hashtags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean)
        .map(t => t.startsWith("#") ? t : `#${t}`);
      await api.put(`/albums/${id}`, { name: form.name, description: form.description, hashtags: tags });
      setEditing(false); load();
    } catch (e) { setError(e.message); }
  }

  async function addPost(postId) {
    try { await api.post(`/albums/${id}/posts/${postId}`); load(); }
    catch (e) { setError(e.message); }
  }
  async function removePost(postId) {
    try { await api.del(`/albums/${id}/posts/${postId}`); load(); }
    catch (e) { setError(e.message); }
  }

  if (!album) return <p className="p-6">{error || "Loading…"}</p>;
  const isOwner = user.username === album.username;

  const ownedPostsNotInAlbum = allPosts.filter(
    (p) => p.username === user.username && !album.posts.includes(p.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {error && <p className="text-red-600">{error}</p>}

      {!editing ? (
        <div>
          <h1 className="font-display text-3xl">{album.name}</h1>
          <p className="text-muted">by {album.username}</p>
          <p className="mt-2">{album.description}</p>
          <div className="flex flex-wrap gap-1 text-xs mt-2">
            {album.hashtags?.map((t, i) => (
              <Link key={i} to={`/search?q=${encodeURIComponent(t)}`} className="text-accent">{t}</Link>
            ))}
          </div>
          {isOwner && (
            <button onClick={() => setEditing(true)} className="btn mt-3">Edit album</button>
          )}
        </div>
      ) : (
        <form onSubmit={saveEdit} className="space-y-2 border border-border rounded p-4 bg-surface">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} />
          <div className="flex gap-2">
            <button className="btn btn-primary">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="btn">Cancel</button>
          </div>
        </form>
      )}

      <section>
        <h2 className="font-display text-xl mb-2">Photos in this album</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {album.postsFull?.map((p) => (
            <div key={p.id} className="border border-border rounded overflow-hidden">
              <Link to={`/posts/${p.id}`}>
                <img src={p.image} alt="" className="w-full aspect-square object-cover" />
              </Link>
              {isOwner && (
                <button onClick={() => removePost(p.id)} className="block w-full text-xs text-red-600 py-1">
                  Remove
                </button>
              )}
            </div>
          ))}
          {album.postsFull?.length === 0 && <p className="text-muted text-sm">No photos yet.</p>}
        </div>
      </section>

      {isOwner && ownedPostsNotInAlbum.length > 0 && (
        <section>
          <h2 className="font-display text-xl mb-2">Add from your posts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ownedPostsNotInAlbum.map((p) => (
              <button key={p.id} onClick={() => addPost(p.id)}
                className="border border-border rounded overflow-hidden hover:border-accent">
                <img src={p.image} alt="" className="w-full aspect-square object-cover" />
                <span className="block text-xs py-1">+ Add to album</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}