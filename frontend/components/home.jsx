import React from 'react';
import MenuContainer from './menu/menu_container';
import FeedContainer from './feed/feed_container';
import PlayBarContainer from './play_bar/play_bar_container';



const Home = (props) => (
    <div>
        <MenuContainer />
        <div className="home">
            <FeedContainer />
            <PlayBarContainer />
        </div>
    </div>
);

export default Home;