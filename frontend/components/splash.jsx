import React from 'react';
import { Link } from 'react-router-dom';



const Splash = (props) => (
    
        <div id="splash">
            <div id="splash_top">
                <div id="top_content">
                    <div id="splash_set"></div>
                    <div id="splash_logo"></div>
                    
                    <h1>Play Chess on the High Seas</h1>
                    <ul>
                        <li><h3>Play with over 2.5 members</h3></li>
                        <li><h3>Improve over time</h3></li>
                        <li><h3>Learn from your mistakes</h3></li>
                    </ul>
                    <button class="play_now">
                    <i class="fas fa-chess-knight"></i> Play Now
                    </button>
                </div>
            </div>
            <div class="splash_bar">
                <Link class="splash_option" to="/learn"><i class="fab fa-leanpub"></i> Learn to Play</Link> 
                <Link class="splash_option" to="/play"><i class="fas fa-robot"></i> Play Computer</Link> 
            <Link class="splash_option" to="/signup"><i class="fas fa-user-plus"></i> Sign Up</Link>
                <Link class="splash_option" to="/login"><i class="fas fa-sign-in-alt"></i> Log In</Link> 
            </div>
            
        </div>
    
);

export default Splash;