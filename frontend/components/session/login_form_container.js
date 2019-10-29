import { login, receiveSessionErrors } from '../../actions/session_actions';
import { setTour } from '../../actions/ui_actions';
import { connect } from 'react-redux';
import LoginForm from './login_form';

const mapStateToProps = (state) => ({
    user: { username: '', email: '', password: '' },
    errors: state.errors.session
});

const mapDispatchToProps = (dispatch) => ({
    login: (user) => dispatch(login(user)),
    clearErrors: () => dispatch(receiveSessionErrors([])),
    setTour: (newTour) => dispatch(setTour(newTour))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);