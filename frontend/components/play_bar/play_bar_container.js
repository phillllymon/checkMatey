import { connect } from 'react-redux';
import { makeEmailChallenge } from '../../actions/ui_actions';
import PlayBar from './play_bar';

const mapStateToProps = (state, ownprops) => ({
    user: state.entities.users[state.session.currentUserId],
    hints: state.ui.hints
});

const mapDispatchToProps = (dispatch) => ({
    makeEmailChallenge: (challengeId) => dispatch(makeEmailChallenge(challengeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);