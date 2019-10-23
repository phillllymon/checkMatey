import { connect } from 'react-redux';
import PlayBar from './play_bar';

const mapStateToProps = (state, ownprops) => ({
    user: state.entities.users[state.session.currentUserId],
    hints: state.ui.hints
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);