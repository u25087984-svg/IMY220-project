import { Link } from "react-router-dom";

function Friend({ friend }) {
    return (
        <div className="friend">
            <Link to={`/profile/${friend.id}`}>
                <img src={friend.profilePic} alt={friend.username} />
                <span>{friend.username}</span>
            </Link>
        </div>
    );
}

export default Friend;