import React from 'react';
import Header from '../components/Header.jsx';
import Feed from '../components/Feed.jsx';
import SearchInput from '../components/SearchInput.jsx';

function Home() {
    return (
        <div className="home">
            <Header />
            <SearchInput />
            <Feed />
        </div>
    );
}

export default Home;