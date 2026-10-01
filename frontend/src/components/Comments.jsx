import React from 'react';

function Comments({ comments, currentUser, postOwner, onDelete }) {
    if (comments.length === 0) {
        return <p className="text-sm text-paper/60">No comments yet.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {comments.map((c) => (
                <div className="flex items-start justify-between gap-2 border-b border-paper/20 pb-2" key={c.id}>
                    <div className="text-sm">
                        <p className="font-bold">{c.commUname}</p>
                        <p>{c.comment}</p>
                    </div>
                    {(c.commUname === currentUser || postOwner === currentUser) && (
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(c.id)}>Delete</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Comments;