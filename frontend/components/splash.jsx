import React from 'react';
import { Link } from 'react-router-dom';



const Splash = (props) => (
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
        Learn Play vsComputer <Link to="/login">Log In</Link> <Link to="/signup">Sign Up</Link>
    </div>
);

export default Splash;