import React from 'react';
import Board from './board';

class ChessTable extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div className="modal_back">
                <Board />   
            </div>
        );
    }
}

export default ChessTable;