import React from 'react';
import TetrisMobile from './tetris_mobile';

class OtherGameMobile extends React.Component {
    constructor(props) {
        super(props);
        this.backToSplash = this.backToSplash.bind(this);
    }

    backToSplash() {
        this.props.history.push('/');
    }

    notBack(e) {
        e.stopPropagation();
    }

    render() {
        return (
            <div onClick={this.backToSplash} className="modal_back">
                <div onClick={this.notBack} className="tetris_box">
                    <TetrisMobile
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

export default OtherGameMobile;