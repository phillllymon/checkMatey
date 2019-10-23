import {
    TOGGLE_HINTS
} from '../actions/ui_actions';

const uiReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case TOGGLE_HINTS:
            return Object.assign(newState, {hints: (!newState.hints)})
        default:
            return state;
    }
};

export default uiReducer;