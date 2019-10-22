import React from 'react';

class GameItem extends React.Component {
    constructor(props) {
        super(props);
        this.resultMessage = this.resultMessage.bind(this);
    }

    resultMessage() {
        switch (this.props.game.ending) {
            case 'accept':
                return ' Draw by agreement';
            case 'resign':
                return ' ' + this.props.game.winner + ' won by resignation';
            case 'Stalemate':
                return ' Game ended in stalemate'
            case 'timeout':
                return ' ' + this.props.game.winner + ' won on time';
            default:
                return ' ' + this.props.game.winner + ' won by checkmate';
        }
    }

    render() {
        
        return (
            <div className="game_list_item">
                
                <i className="fas fa-user" style={{ 'margin': '5px', 'color': 'white' }}></i>{this.props.game.player_white.username} -
                <i className="fas fa-user" style={{ 'margin': '5px', 'color': 'black' }}></i>{this.props.game.player_black.username} -
                {this.resultMessage()}
                <div className="time_stamp">
                    <i>{this.props.game.created_at.slice(0, 10)}</i>
                </div>
            </div>
        );
    }
}

export default GameItem;