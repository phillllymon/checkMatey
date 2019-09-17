import { connect } from 'react-redux';
import { fetchScore, postScore } from './score_util';
import OtherGame from './other_game.jsx';

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    fetchScore: fetchScore,
    postScore: postScore
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherGame);