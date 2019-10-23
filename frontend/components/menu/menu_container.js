import { connect } from 'react-redux';
import Menu from './menu';
import { logout } from '../../actions/session_actions';
import { toggleHints } from '../../actions/ui_actions';

const mapStateToProps = (state) => ({
    user: state.entities.users[state.session.currentUserId],
    hints: state.ui.hints
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
    toggleHints: () => dispatch(toggleHints())
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);