import React from 'react';
import { Link } from 'react-router-dom';

const MobileSplash = (props) => (
    <div className="mobile_container">
        <center>
        <div id="splash_logo_mobile"></div>
        <div id="splash_set_mobile"></div>         
        <Link className="mobile_button" to="/signup">
            <i 
                className="fas fa-user-plus" 
                style={{'marginRight': '20px'}}>
            </i> 
            Sign Up
        </Link>
        <Link className="mobile_button" to="/login">
            <i 
                className="fas fa-sign-in-alt" 
                style={{ 'marginRight': '20px' }}>
            </i> 
            Log In
        </Link>
        <Link className="mobile_button" to="/notChess">
            <i 
                className="fas fa-cubes" 
                style={{ 'marginRight': '20px' }}>
            </i> 
            Not Chess
        </Link>
        </center>
    </div>

);

export default MobileSplash;