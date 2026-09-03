import React from 'react';

function Comments({ comments }) {
    return (
        <div>
            {comments.map((comment) => (
                <div key={comment.id}>
                    <p>{comment.commUname}</p>
                    <p>{comment.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default Comments;