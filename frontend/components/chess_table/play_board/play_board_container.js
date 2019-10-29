import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../../actions/game_actions';
import { login } from '../../../actions/session_actions';
import PlayBoard from './play_board';
import { withRouter } from 'react-router-dom';
import { setTour } from '../../../actions/ui_actions';

const mapStateToProps = (state, ownProps) => ({
    userId: state.session.currentUserId,
    game: state.entities.currentGame,
    gameErrors: state.errors.game,
    hints: state.ui.hints
});

const mapDispatchToProps = (dispatch) => ({
    updateGame: (game) => dispatch(updateGame(game)),
    archiveGame: archiveGame,
    login: (user) => dispatch(login(user)),
    setTour: (newTour) => dispatch(setTour(newTour))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayBoard));