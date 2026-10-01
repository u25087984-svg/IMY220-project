import { Link } from "react-router-dom";
import { enc } from "../api.js";

function PostPreview({ post }) {
    return (
        <div className="overflow-hidden border border-paper/70 bg-black/40 transition hover:border-accent">
            <Link to={`/post/${post.id}`}>
                <img className="aspect-square w-full object-cover" src={post.image} alt={post.caption} />
            </Link>
            <div className="space-y-1 p-2 text-sm">
                <Link className="font-bold hover:text-accent" to={`/profile/${enc(post.username)}`}>
                    {post.username}
                </Link>
                <p className="truncate">{post.caption}</p>
                <p className="tag truncate">{(post.hashtags || []).join(' ')}</p>
            </div>
        </div>
    );
}

export default PostPreview;