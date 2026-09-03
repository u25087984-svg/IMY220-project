import { Link } from "react-router-dom";

function ProfilePreview({ user }) {
    return (
        <div className="profile-preview">
            <Link to={`/profile/${user.id}`}>
                <img src={user.profilePic} alt={user.username} />
                <span>{user.username}</span>
            </Link>
        </div>
    );
}

export default ProfilePreview;