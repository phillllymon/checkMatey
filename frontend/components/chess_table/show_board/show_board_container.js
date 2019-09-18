import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../../actions/game_actions';
import ShowBoard from './show_board';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => ({
    game: state.entities.currentGame,
    gameErrors: state.errors.game
});

const mapDispatchToProps = (dispatch) => ({
    
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShowBoard));