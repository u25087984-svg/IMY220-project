import React, { useState } from 'react';

function EditProfile({ user }) {
    const [bio, setBio] = useState(user.bio);
    const [profilePic, setProfilePic] = useState(user.profilePic);

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Updated profile:', { id: user.id, bio, profilePic });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Bio:
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </label>

            <label>
                Profile picture path:
                <input
                    type="text"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                />
            </label>

            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditProfile;