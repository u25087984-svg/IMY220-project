import React, { useState } from 'react';

function SearchInput() {
    const [searchTerm, setSearchTerm] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Search for:', searchTerm);
    }

    return (
        <form onSubmit={handleSubmit} className="search-input">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchInput;