import React from 'react';
import Board from './board';

class ChessTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal_back">
                <div className="chess_table">
                    <Board game={this.props.board} />
                    <div className="game_stats">
                        game stats
                    </div>
                </div>
            </div>
        );
    }
}

export default ChessTable;