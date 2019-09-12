import { signup, receiveSessionErrors } from '../../actions/session_actions';
import { connect } from 'react-redux';
import SignupForm from './signup_form';

const mapStateToProps = (state) => ({
    user: {username: '', email: '', password: ''},
    errors: state.errors.session
});

const mapDispatchToProps = (dispatch) => ({
    signup: (user) => dispatch(signup(user)),
    clearErrors: () => dispatch(receiveSessionErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);