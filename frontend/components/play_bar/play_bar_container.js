import { connect } from 'react-redux';
import { makeEmailChallenge, clearChallenges } from '../../actions/ui_actions';
import { logout } from '../../actions/session_actions';
import PlayBar from './play_bar';

const mapStateToProps = (state, ownprops) => ({
    user: state.entities.users[state.session.currentUserId],
    hints: state.ui.hints,
    challenges: state.ui.challenges
});

const mapDispatchToProps = (dispatch) => ({
    makeEmailChallenge: (challengeId) => dispatch(makeEmailChallenge(challengeId)),
    clearChallenges: () => dispatch(clearChallenges()),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);