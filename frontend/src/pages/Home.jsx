import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PostPreview from "../components/PostPreview";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const [scope, setScope] = useState("global");
  const [mode, setMode] = useState("posts");
  const [sort, setSort] = useState("recent");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setError("");
    try {
      let data;
      if (mode === "posts") {
        const url = scope === "global" ? `/posts${sort === "comments" ? "?sort=comments" : ""}` : `/posts/feed/${encodeURIComponent(user.username)}`;
        data = await api.get(url);
        if (scope === "local" && sort === "comments") data = [...data].sort((a, b) => b.comments.length - a.comments.length);
      } else {
        const url = scope === "global" ? "/activity" : `/activity/feed/${encodeURIComponent(user.username)}`;
        data = await api.get(url);
      }
      setItems(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (user) load(); /* eslint-disable-next-line */ }, [scope, mode, sort]);

  return (
    <div className="max-w-[1200px] mx-auto p-4 space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center gap-4 border-b-4 border-white pb-4">
        <div className="flex gap-2">
          <button onClick={() => setScope("global")} className={`btn px-4 py-0 ${scope === "global" ? "bg-white text-black" : ""}`}>global</button>
          <button onClick={() => setScope("local")} className={`btn px-4 py-0 ${scope === "local" ? "bg-white text-black" : ""}`}>friends</button>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setMode("posts")} className={`btn px-4 py-0 ${mode === "posts" ? "bg-white text-black" : ""}`}>posts</button>
          <button onClick={() => setMode("activity")} className={`btn px-4 py-0 ${mode === "activity" ? "bg-white text-black" : ""}`}>activity</button>
        </div>

        {mode === "posts" && (
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="max-w-[200px] py-0 text-xl">
            <option value="recent">Newest First</option>
            <option value="comments">Most Comments</option>
          </select>
        )}

        <Link to="/create" className="btn ml-auto px-6 py-0">+ new post</Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading…</p>}

      {mode === "posts" && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((p) => <PostPreview key={p.id} post={p} onChanged={load} />)}
          {items.length === 0 && <p className="text-xl text-gray-400">No posts yet.</p>}
        </div>
      )}

      {mode === "activity" && !loading && (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="border-b-2 border-white/20 pb-2 text-xl">
              <Link to={`/profile/${encodeURIComponent(a.username)}`} className="font-bold hover:underline">{a.username}</Link>{" "}
              {a.type === "post_created" && <>created a post.</>}
              {a.type === "album_created" && <>created album <em>{a.metadata?.name}</em>.</>}
              {a.type === "photos_added" && <>added {a.metadata?.count || "some"} photos to <em>{a.metadata?.name || "an album"}</em>.</>}
              {a.type === "comment_added" && <>commented on a post.</>}
            </li>
          ))}
          {items.length === 0 && <p className="text-xl text-gray-400">No activity yet.</p>}
        </ul>
      )}
    </div>
  );
}