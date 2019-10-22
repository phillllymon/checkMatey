import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../../actions/game_actions';
import VsBoard from './vs_board';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => ({
    userId: state.session.currentUserId,
    userRating: state.entities.users[state.session.currentUserId].rating,
    game: state.entities.currentGame,
    gameErrors: state.errors.game
});

const mapDispatchToProps = (dispatch) => ({
    updateGame: (game) => dispatch(updateGame(game)),
    archiveGame: archiveGame
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VsBoard));