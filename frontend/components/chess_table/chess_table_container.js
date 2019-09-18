import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../actions/game_actions';
import { createPost } from '../../actions/post_actions';
import ChessTable from './chess_table';

const mapStateToProps = (state, ownProps) => ({
    banana: ownProps.history,
    game: state.entities.currentGame,
    gameErrors: state.errors.game
});

const mapDispatchToProps = (dispatch) => ({
    updateGame: (game) => dispatch(updateGame(game)),
    archiveGame: archiveGame,
    postSeq: (seq) => dispatch(createPost(seq))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChessTable);