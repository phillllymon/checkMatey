import { connect } from 'react-redux';
import { makeEmailChallenge, clearChallenges } from '../../actions/ui_actions';
import PlayBar from './play_bar';

const mapStateToProps = (state, ownprops) => ({
    user: state.entities.users[state.session.currentUserId],
    hints: state.ui.hints,
    challenges: state.ui.challenges
});

const mapDispatchToProps = (dispatch) => ({
    makeEmailChallenge: (challengeId) => dispatch(makeEmailChallenge(challengeId)),
    clearChallenges: () => dispatch(clearChallenges())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);