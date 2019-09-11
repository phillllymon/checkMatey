import { connect } from 'react-redux';
import Menu from './menu';
import { logout } from '../../actions/session_actions';

const mapStateToProps = (state) => ({
    user: state.entities.users[state.session.currentUserId]
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);