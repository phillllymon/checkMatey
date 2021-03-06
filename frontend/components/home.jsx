import React from 'react';
import MenuContainer from './menu/menu_container';
import FeedContainer from './feed/feed_container';
import PlayBarContainer from './play_bar/play_bar_container';
import { Route } from 'react-router-dom';




const Home = (props) => {
    if (typeof window.orientation !== 'undefined') {
        return (
            <div>
                <PlayBarContainer />
            </div>
        );
    }
    else {
        return (
            <div>
                <div className="home">
                    
                    <MenuContainer />
                    <div>
                        <div id="ahoy" className="home_stack"> 
                            Ahoy, {props.user.username}!
                        </div>
                        <PlayBarContainer />
                        <FeedContainer />
                    </div>
                </div>

            </div>
        );
    }
};

export default Home;