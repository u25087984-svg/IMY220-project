import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import ImageDropzone from "../components/ImageDropzone";

export default function CreatePost() {
  const nav = useNavigate();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
      const p = await api.post("/posts", { caption, image, hashtags: tags });
      nav(`/posts/${p.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="font-display text-2xl">New post</h1>
      {error && <p className="text-red-600">{error}</p>}

      <ImageDropzone value={image} onChange={setImage} label="Photo" />

      <label className="block">
        <span className="text-sm text-muted">Caption</span>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm text-muted">Hashtags</span>
        <input
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="#sunset #campus"
        />
      </label>

      <button disabled={busy || !image} className="btn btn-primary">
        {busy ? "Posting…" : "Post"}
      </button>
    </form>
  );
}