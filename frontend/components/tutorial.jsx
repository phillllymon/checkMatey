import { Link } from 'react-router-dom';

import React from 'react';

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.backToHome = this.backToHome.bind(this);
    }

    backToHome(e) {
        this.props.history.push('/home');
    }


    render() {
        return (
            <div className="modal_back" >
                <Link 
                    to={'/home'}
                    style={{
                        'textDecoration': 'none',
                        'color': 'gray'
                    }}
                >
                    X
                </Link>
                <div className="video">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/MNlpxrdSCoU?rel=0" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>

                    </iframe>
                </div>
            </div>
        ); 
    }
}

export default Tutorial;