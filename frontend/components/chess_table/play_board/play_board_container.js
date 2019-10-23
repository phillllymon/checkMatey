import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../../actions/game_actions';
import PlayBoard from './play_board';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => ({
    game: state.entities.currentGame,
    gameErrors: state.errors.game,
    hints: state.ui.hints
});

const mapDispatchToProps = (dispatch) => ({
    updateGame: (game) => dispatch(updateGame(game)),
    archiveGame: archiveGame
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayBoard));