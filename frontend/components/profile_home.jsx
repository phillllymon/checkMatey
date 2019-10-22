import React from 'react';
import MenuContainer from './menu/menu_container';
import ProfileContainer from './profile/profile_container';
import PlayBarContainer from './play_bar/play_bar_container';




const ProfileHome = (props) => {
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
                    <ProfileContainer />
                    <PlayBarContainer />
                </div>

            </div>
        );
    }
};

export default ProfileHome;