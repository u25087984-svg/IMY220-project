import { Link } from "react-router-dom";

function PostPreview({ post }) {
    return (
        <div className="post-preview">
            <Link to={`/post/${post.id}`}>
                <img src={post.image} alt={post.caption} />
                <p>{post.username}</p>
                <p>{post.caption}</p>
            </Link>
        </div>
    );
}

export default PostPreview;