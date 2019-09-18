import React from 'react';
import BoardContainer from './board_container';

class ChessTable extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div className="modal_back">
                <BoardContainer postSeq={this.props.postSeq} />   
            </div>
        );
    }
}

export default ChessTable;