import { signup, receiveSessionErrors, login } from '../../actions/session_actions';
import { setTour } from '../../actions/ui_actions';
import { connect } from 'react-redux';
import SignupForm from './signup_form';

const mapStateToProps = (state) => ({
    user: {username: '', email: '', password: ''},
    errors: state.errors.session
});

const mapDispatchToProps = (dispatch) => ({
    signup: (user) => dispatch(signup(user)),
    clearErrors: () => dispatch(receiveSessionErrors([])),
    login: (user) => dispatch(login(user)),
    setTour: (newTour) => dispatch(setTour(newTour))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);