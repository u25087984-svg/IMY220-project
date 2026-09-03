import React from 'react';

function Comments({ comments }) {
    return (
        <div className="comments">
            {comments.map((comment) => (
                <div className="comment" key={comment.id}>
                    <p>{comment.commUname}</p>
                    <p>{comment.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default Comments;