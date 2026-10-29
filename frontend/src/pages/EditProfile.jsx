import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ImageDropzone from "../components/ImageDropzone";

export default function EditProfile() {
  const { username } = useParams();
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    pronouns: "",
    bio: "",
    profilePic: "",
    socialLinks: { instagram: "", twitter: "", website: "" },
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/users/${encodeURIComponent(username)}`)
      .then((p) => {
        setForm({
          name: p.name || "",
          pronouns: p.pronouns || "",
          bio: p.bio || "",
          profilePic: p.profilePic || "",
          socialLinks: {
            instagram: p.socialLinks?.instagram || "",
            twitter: p.socialLinks?.twitter || "",
            website: p.socialLinks?.website || "",
          },
        });
      })
      .catch((e) => setError(e.message));
  }, [username]);

  function set(k) {
    return (e) => setForm({ ...form, [k]: e.target.value });
  }
  function setSocial(k) {
    return (e) =>
      setForm({ ...form, socialLinks: { ...form.socialLinks, [k]: e.target.value } });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const updated = await api.put(`/users/${encodeURIComponent(username)}`, form);
      if (user?.username === updated.username) {
        setUser({ ...user, ...updated });
      }
      nav(`/profile/${encodeURIComponent(username)}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="font-display text-2xl">Edit profile</h1>
      {error && <p className="text-red-600">{error}</p>}

      <ImageDropzone
        value={form.profilePic}
        onChange={(url) => setForm({ ...form, profilePic: url })}
        label="Profile picture"
      />

      <label className="block">
        <span className="text-sm text-muted">Display name</span>
        <input value={form.name} onChange={set("name")} />
      </label>

      <label className="block">
        <span className="text-sm text-muted">Pronouns</span>
        <input value={form.pronouns} onChange={set("pronouns")} placeholder="e.g. she/her" />
      </label>

      <label className="block">
        <span className="text-sm text-muted">Bio</span>
        <textarea rows={3} value={form.bio} onChange={set("bio")} />
      </label>

      <fieldset className="border border-border rounded p-3 space-y-2">
        <legend className="text-sm text-muted px-1">Social links</legend>
        <input
          placeholder="Instagram handle"
          value={form.socialLinks.instagram}
          onChange={setSocial("instagram")}
        />
        <input
          placeholder="X / Twitter handle"
          value={form.socialLinks.twitter}
          onChange={setSocial("twitter")}
        />
        <input
          placeholder="Website URL"
          value={form.socialLinks.website}
          onChange={setSocial("website")}
        />
      </fieldset>

      <div className="flex gap-2">
        <button disabled={busy} className="btn btn-primary">
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => nav(-1)} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}