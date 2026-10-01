import React from 'react';

function SearchInput({ term, setTerm }) {
    return (
        <input
            className="input mb-4"
            type="text"
            placeholder="Search users, captions or #hashtags..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
        />
    );
}

export default SearchInput;