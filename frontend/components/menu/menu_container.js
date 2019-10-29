import { connect } from 'react-redux';
import Menu from './menu';
import { logout } from '../../actions/session_actions';
import { toggleHints, setTour } from '../../actions/ui_actions';

const mapStateToProps = (state) => ({
    user: state.entities.users[state.session.currentUserId],
    hints: state.ui.hints,
    tour: state.ui.tour
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
    toggleHints: () => dispatch(toggleHints()),
    setTour: (newTour) => dispatch(setTour(newTour))
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);