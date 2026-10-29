import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PostPreview({ post }) {
  const { user } = useAuth();
  const reportCount = post.reportCount ?? post.reports?.length ?? 0;

  if (reportCount > 2) {
    return (
      <div className="border-4 border-white p-4 text-center flex flex-col items-center justify-center aspect-square">
        <p className="mb-4">This post was reported.</p>
        <button className="btn text-lg px-2 py-0">view</button>
      </div>
    );
  }

  return (
    <Link to={`/posts/${post.id}`} className="group flex flex-col gap-2">
      {/* Thick bordered image container - grayscale removed from img tag */}
      <div className="border-4 border-white aspect-square overflow-hidden bg-black">
        <img 
          src={post.image} 
          alt={post.caption} 
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>
      
      {/* Username below image */}
      <div className="flex items-center gap-2">
        {/* Placeholder for your profile icon */}
        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-xs">P</div>
        <span className="text-xl">{post.username}</span>
      </div>
    </Link>
  );
}