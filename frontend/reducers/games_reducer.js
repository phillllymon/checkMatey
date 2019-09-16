import {
    UPDATE_GAME
} from '../actions/game_actions';

const gamesReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case UPDATE_GAME:
            return Object.assign(newState, action.game);
        default:
            return state;
    }
};

export default gamesReducer;