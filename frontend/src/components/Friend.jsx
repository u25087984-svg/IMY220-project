import { Link } from "react-router-dom";
import { enc } from "../api.js";

function Friend({ friend }) {
    return (
        <Link className="flex items-center gap-2 border border-paper/50 px-2 py-1 text-sm hover:border-accent"
            to={`/profile/${enc(friend.username)}`}>
            <img className="h-8 w-8 rounded-full object-cover" src={friend.profilePic} alt={friend.username} />
            <span>{friend.username}</span>
        </Link>
    );
}

export default Friend;