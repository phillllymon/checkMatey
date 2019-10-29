import {
    TOGGLE_HINTS,
    SET_TOUR
} from '../actions/ui_actions';

const uiReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case TOGGLE_HINTS:
            return Object.assign(newState, {hints: (!newState.hints)});
        case SET_TOUR:
            return Object.assign(newState, {tour: action.newTour})
        default:
            return state;
    }
};

export default uiReducer;