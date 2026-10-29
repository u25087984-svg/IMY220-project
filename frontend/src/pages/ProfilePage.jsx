import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PostPreview from "../components/PostPreview";

export default function ProfilePage() {
  const { username } = useParams();
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    try {
      const p = await api.get(`/users/${encodeURIComponent(username)}`);
      setProfile(p);
      const allPosts = await api.get("/posts");
      setPosts(allPosts.filter((pp) => pp.username === p.username));
    } catch (e) { setError(e.message); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [username]);

  async function sendRequest() { setBusy(true); try { await api.post(`/users/${encodeURIComponent(profile.username)}/friend-request`); await load(); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  async function acceptRequest() { setBusy(true); try { await api.post(`/users/${encodeURIComponent(profile.username)}/accept`); await load(); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  async function declineRequest() { setBusy(true); try { await api.post(`/users/${encodeURIComponent(profile.username)}/decline`); await load(); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  async function unfriend() { if (!confirm("Unfriend?")) return; setBusy(true); try { await api.post(`/users/${encodeURIComponent(profile.username)}/unfriend`); await load(); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  async function deleteAccount() { if (!confirm("Delete your profile entirely?")) return; try { await api.del(`/users/${encodeURIComponent(profile.username)}`); await logout(); nav("/"); } catch (e) { setError(e.message); } }

  if (error && !profile) return <p className="p-6 text-red-500">{error}</p>;
  if (!profile) return <p className="p-6">Loading…</p>;

  const isSelf = profile.username === user.username;
  const status = profile.friendshipStatus;
  const friendsFull = profile.friendsFull || [];

  return (
    <div className="max-w-[1200px] mx-auto p-4 space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          
          {/* THE FIX: Checks if profilePic exists, otherwise shows a blank square */}
          <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-white overflow-hidden bg-black flex-shrink-0">
            {profile.profilePic ? (
              <img 
                src={profile.profilePic} 
                alt={profile.username} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">
                ?
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl">{profile.username}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {isSelf ? (
            <>
              <Link to={`/profile/${encodeURIComponent(profile.username)}/edit`} className="btn">edit profile</Link>
              <button onClick={deleteAccount} className="btn">delete account</button>
            </>
          ) : (
            <>
              {status === "friends" && <button onClick={unfriend} disabled={busy} className="btn">unfriend</button>}
              {status === "none" && <button onClick={sendRequest} disabled={busy} className="btn">add friend</button>}
              {status === "incoming" && (
                <>
                  <button onClick={acceptRequest} disabled={busy} className="btn">accept</button>
                  <button onClick={declineRequest} disabled={busy} className="btn">decline</button>
                </>
              )}
              {status === "outgoing" && <button disabled className="btn border-gray-500 text-gray-500">requested</button>}
            </>
          )}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Friends List */}
      {friendsFull.length > 0 && (status === "friends" || isSelf || user.role === "admin") && (
        <section className="border-t-4 border-white pt-4">
          <h2 className="text-2xl mb-3">friends ({friendsFull.length})</h2>
          <div className="flex gap-4 flex-wrap">
            {friendsFull.map((f) => (
              <Link key={f.id} to={`/profile/${encodeURIComponent(f.username)}`} className="flex items-center gap-2 hover:opacity-70">
                <span className="text-xl underline">{f.username}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {profile.albums?.length > 0 && (
        <section className="border-t-4 border-white pt-4">
          <h2 className="text-2xl mb-3">albums</h2>
          <div className="flex gap-2 flex-wrap">
            {profile.albums.map((a) => (
              <Link key={a.id} to={`/albums/${a.id}`} className="btn text-lg">{a.name}</Link>
            ))}
          </div>
        </section>
      )}

      {/* Post Grid */}
      <section className="border-t-4 border-white pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {posts.map((p) => (
            <PostPreview key={p.id} post={p} />
          ))}
          {posts.length === 0 && <p className="text-xl text-gray-400">no posts yet.</p>}
        </div>
      </section>
      
    </div>
  );
}