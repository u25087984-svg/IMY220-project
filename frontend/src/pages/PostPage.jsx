import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ReportModal from "../components/ReportModal";

export default function PostPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [albumList, setAlbumList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const p = await api.get(`/posts/${id}`);
      setPost(p);
      const albums = await Promise.all((p.albums || []).map((aid) => api.get(`/albums/${aid}`).catch(() => null)));
      setAlbumList(albums.filter(Boolean));
    } catch (e) { setError(e.message); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try { await api.post(`/posts/${id}/comments`, { comment: newComment.trim() }); setNewComment(""); load(); } 
    catch (e) { setError(e.message); }
  }

  async function deleteComment(commentId) {
    if (!confirm("Delete this comment?")) return;
    try { await api.del(`/posts/${id}/comments/${commentId}`); load(); } catch (e) { setError(e.message); }
  }

  async function deletePost() {
    if (!confirm("Delete this post?")) return;
    try { await api.del(`/posts/${id}`); nav("/home"); } catch (e) { setError(e.message); }
  }

  if (error && !post) return <p className="p-6 text-red-500">{error}</p>;
  if (!post) return <p className="p-6">Loading…</p>;

  const isOwner = user.username === post.username;
  const isAdmin = user.role === "admin";

  return (
    <div className="max-w-[1000px] mx-auto p-4 flex flex-col items-center">
      
      {/* The large image layout from Screenshot #2 */}
      <div className="w-full max-w-[600px] border-4 border-white aspect-square bg-black mb-4">
        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
      </div>

      {/* Username row below */}
      <div className="w-full max-w-[600px] flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-4 border-white rounded-full flex items-center justify-center text-sm">P</div>
          <Link to={`/profile/${encodeURIComponent(post.username)}`} className="text-3xl hover:underline">
            {post.username}
          </Link>
        </div>
        <div className="flex gap-2">
          {(isOwner || isAdmin) && (
            <>
              <Link to={`/posts/${post.id}/edit`} className="btn">edit</Link>
              <button onClick={deletePost} className="btn text-red-500 border-red-500 hover:bg-red-500 hover:text-white">delete</button>
            </>
          )}
          {!isOwner && (
            <button onClick={() => setShowReport(true)} className="btn">report</button>
          )}
        </div>
      </div>

      {/* Details & Comments (placed below the image now) */}
      <div className="w-full max-w-[600px] border-t-4 border-white pt-4">
        {post.caption && <p className="text-2xl mb-2">{post.caption}</p>}
        
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-3 text-xl text-gray-400 mb-4">
            {post.hashtags.map((t, i) => (
              <Link key={i} to={`/search?q=${encodeURIComponent(t)}`} className="hover:text-white underline">{t}</Link>
            ))}
          </div>
        )}

        {albumList.length > 0 && (
          <div className="mb-6">
            <p className="text-sm uppercase text-gray-400 mb-1">In albums</p>
            <div className="flex flex-wrap gap-2">
              {albumList.map((a) => (
                <Link key={a.id} to={`/albums/${a.id}`} className="btn text-sm px-2 py-0">{a.name}</Link>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-2xl mb-2">comments ({post.comments.length})</h3>
        <ul className="space-y-3 mb-4">
          {post.comments.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-2 border-b border-white/20 pb-1">
              <span className="text-xl">
                <span className="font-bold">{c.commUname}</span> {c.comment}
              </span>
              {(user.username === c.commUname || isAdmin) && (
                <button onClick={() => deleteComment(c.id)} className="text-sm text-red-500 hover:underline mt-1">delete</button>
              )}
            </li>
          ))}
          {post.comments.length === 0 && <li className="text-xl text-gray-500">No comments yet.</li>}
        </ul>

        <form onSubmit={submitComment} className="flex gap-2">
          <input placeholder="Add a comment…" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1" />
          <button className="btn px-4">post</button>
        </form>
      </div>

      {showReport && <ReportModal postId={post.id} onClose={() => { setShowReport(false); load(); }} />}
    </div>
  );
}