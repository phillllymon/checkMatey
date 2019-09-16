import { connect } from 'react-redux';
import { archiveGame, updateGame } from '../../actions/game_actions';
import ChessTable from './chess_table';

const mapStateToProps = (state) => ({
    game: state.entities.currentGame,
    gameErrors: state.errors.game
});

const mapDispatchToProps = (dispatch) => ({
    updateGame: (game) => dispatch(updateGame(game)),
    archiveGame: archiveGame
});

export default connect(mapStateToProps, mapDispatchToProps)(ChessTable);