import React, { useState } from 'react';

function EditPost({ post }) {
    const [caption, setCaption] = useState(post.caption);
    const [image, setImage] = useState(post.image);

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Updated post:', { id: post.id, caption, image });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Caption:
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
            </label>

            <label>
                Image path:
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
            </label>

            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditPost;