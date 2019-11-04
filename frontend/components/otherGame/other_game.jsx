import React from 'react';
import Tetris from './tetris';
import { Link } from 'react-router-dom';

class OtherGame extends React.Component {
    constructor(props) {
        super(props);
        this.backToSplash = this.backToSplash.bind(this);
    }

    backToSplash() {
        this.props.history.push('/home');
    }

    notBack(e) {
        e.stopPropagation();
    }

    render() {
        return (
            <div className="modal_back">
                <Link to={'/home'} style={{'textDecoration': 'none'}}><div className="close_x" >X</div></Link>
                <div onClick={this.notBack} className="tetris_box">
                    <Tetris 
                        fetchAllPosts={this.props.fetchAllPosts}
                        createPost={this.props.createPost}
                        updatePost={this.props.createPost}
                        allPosts={this.props.allPosts}
                    />
                </div>
            </div>
        );
    }
}

export default OtherGame;