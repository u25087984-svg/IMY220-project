import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function EditPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((p) => {
        setCaption(p.caption || "");
        setHashtags((p.hashtags || []).join(" "));
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const tags = hashtags
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));
      await api.put(`/posts/${id}`, { caption, hashtags: tags });
      nav(`/posts/${id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="font-display text-2xl">Edit post</h1>
      {error && <p className="text-red-600">{error}</p>}

      <label className="block">
        <span className="text-sm text-muted">Caption</span>
        <textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} />
      </label>

      <label className="block">
        <span className="text-sm text-muted">Hashtags</span>
        <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
      </label>

      <button disabled={busy} className="btn btn-primary">
        {busy ? "Saving…" : "Save"}
      </button>
    </form>
  );
}