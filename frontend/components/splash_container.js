import { login } from '../actions/session_actions';
import { connect } from 'react-redux';
import Splash from './splash';

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    login: (user) => dispatch(login(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);