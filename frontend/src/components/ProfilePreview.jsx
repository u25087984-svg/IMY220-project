import { Link } from "react-router-dom";
import { enc } from "../api.js";

function ProfilePreview({ user }) {
    return (
        <Link className="flex shrink-0 flex-col items-center gap-1 text-xs hover:text-accent"
            to={`/profile/${enc(user.username)}`}>
            <img className="h-14 w-14 rounded-full border-2 border-paper object-cover" src={user.profilePic} alt={user.username} />
            <span>{user.username}</span>
        </Link>
    );
}

export default ProfilePreview;