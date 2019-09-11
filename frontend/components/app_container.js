import { connect } from 'react-redux';
import App from './App';

const mapStateToProps = (state) => ({
    userId: state.session.currentUserId
});

export default connect(mapStateToProps, null)(App);