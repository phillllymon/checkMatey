import React from 'react';
import { Link } from 'react-router-dom';



const Splash = (props) => (
    <center>
        <div id="splash">
            <h3>CheckMatey</h3>
            <h2>Play Chess Online
                <br/>
                on the High Seas
            </h2>
            <ul>
                <li>Play with over 2.5 members</li>
                <li>Improve over time</li>
                <li>Learn from your mistakes</li>
            </ul>
            <div class="spash_bar">
                <Link to="/learn">
                    <span class="splash_option">Learn to Play</span>
                </Link> 
                <Link to="/play">
                    <span class="splash_option">Play Computer</span>
                </Link> 
                <Link to="/login">
                    <span class="splash_option">Log In</span>
                </Link> 
                <Link to="/signup">
                    <span class="splash_option">Sign Up</span>
                </Link>
            </div>
            
        </div>
    </center>
);

export default Splash;