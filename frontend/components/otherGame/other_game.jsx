import React from 'react';
import Tetris from './tetris';

class OtherGame extends React.Component {
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
                    <Tetris />
                </div>
            </div>
        );
    }
}

export default OtherGame;