import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../../actions/game_actions';
import VsBoardMobile from './vs_board_mobile';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => ({
    game: state.entities.currentGame,
    gameErrors: state.errors.game
});

const mapDispatchToProps = (dispatch) => ({
    updateGame: (game) => dispatch(updateGame(game)),
    archiveGame: archiveGame
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VsBoardMobile));