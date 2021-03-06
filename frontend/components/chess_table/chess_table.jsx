import React from 'react';
import BoardContainer from './board_container';
import ShowBoardContainer from './show_board/show_board_container';
import PlayBoardContainer from './play_board/play_board_container';
import VsBoardContainer from './vs_board/vs_board_container';
import VsBoardMobileContainer from './vs_board/vs_board_mobile_container';

class ChessTable extends React.Component {
    constructor(props) {
        super(props);
        this.backToHome = this.backToHome.bind(this);
    }

    backToHome(e) {
        this.props.history.push('/home');
    }

    render() {
        if (this.props.mode === 'playComputer'){
            return (
                <div>
                    <div className="modal_back" ><div className="close_x" onClick={this.backToHome}>X</div></div>
                    <PlayBoardContainer mode={'playCompuer'} backToHome={this.backToHome} player={this.props.player} />
                </div>
            );
        }
        if (this.props.mode === 'sandbox') {
            return (
                <div>
                    <div className="modal_back" ><div className="close_x" onClick={this.backToHome}>X</div></div>
                    <BoardContainer postSeq={this.props.postSeq} mode={'sandbox'} />
                </div>
            );
        }
        if (this.props.mode === 'vs') {
            return (
                <div>
                    <div className="modal_back"></div>
                    <VsBoardContainer 
                        backToLobby={this.props.backToLobby}
                        mode={'vs'} 
                        player={this.props.player}
                        opponent={this.props.opponent}
                        color={this.props.color}
                        time={this.props.time}
                        gameId={this.props.gameId}
                        gameType={this.props.gameType}
                        gameTime={this.props.gameTime}
                        leaveGame={this.props.leaveGame}
                    />
                </div>
            );
        }
        if (this.props.mode === 'vsMobile') {
            return (
                <div>
                    <div className="modal_back"></div>
                    <VsBoardMobileContainer
                        mode={'vs'}
                        player={this.props.player}
                        opponent={this.props.opponent}
                        color={this.props.color}
                        time={this.props.time}
                        gameId={this.props.gameId}
                        gameType={this.props.gameType}
                        gameTime={this.props.gameTime}
                        leaveGame={this.props.leaveGame}
                    />
                </div>
            );
        }
        if (this.props.location.state === undefined){
            return(
                <div>
                    
                </div>
            );
        }
        return (
            <div>
                <div className="modal_back" onClick={this.backToHome}></div>
                <ShowBoardContainer seq={this.props.location.state.post} mode={'seeSeq'}/>
            </div>
        );
    }
}

export default ChessTable;