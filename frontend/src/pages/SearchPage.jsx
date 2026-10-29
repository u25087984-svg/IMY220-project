import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState({ users: [], posts: [], albums: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) { setResults({ users: [], posts: [], albums: [] }); return; }
    setLoading(true); setError("");
    api.get(`/search?q=${encodeURIComponent(q)}`)
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="font-display text-3xl">Search: "{q}"</h1>
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Searching…</p>}

      {!loading && (
        <>
          <section>
            <h2 className="font-display text-xl mb-2">Users ({results.users.length})</h2>
            <ul className="space-y-1">
              {results.users.map((u) => (
                <li key={u.id}>
                  <Link to={`/profile/${encodeURIComponent(u.username)}`} className="hover:text-accent">
                    <strong>{u.name || u.username}</strong> · {u.username}
                  </Link>
                </li>
              ))}
              {results.users.length === 0 && <li className="text-muted text-sm">No matching users.</li>}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">Posts ({results.posts.length})</h2>
            <ul className="space-y-2">
              {results.posts.map((p) => (
                <li key={p.id}>
                  <Link to={`/posts/${p.id}`} className="hover:text-accent">
                    <strong>{p.username}</strong>: {p.caption}
                  </Link>
                </li>
              ))}
              {results.posts.length === 0 && <li className="text-muted text-sm">No matching posts.</li>}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">Albums ({results.albums.length})</h2>
            <ul className="space-y-1">
              {results.albums.map((a) => (
                <li key={a.id}>
                  <Link to={`/albums/${a.id}`} className="hover:text-accent">
                    <strong>{a.name}</strong> — {a.description}
                  </Link>
                </li>
              ))}
              {results.albums.length === 0 && <li className="text-muted text-sm">No matching albums.</li>}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}