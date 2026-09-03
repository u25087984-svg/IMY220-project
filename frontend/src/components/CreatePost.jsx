import React, { useState } from 'react';

function CreatePost() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        console.log('New post:', { caption, image });
        setCaption('');
        setImage('');
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

            <button type="submit">Post</button>
        </form>
    );
}

export default CreatePost;