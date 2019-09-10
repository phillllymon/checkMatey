import {
    RECEIVE_CURRENT_USER,
    LOGOUT_USER,
} from '../actions/session_actions';

const defaultState = {
    currentUserId: null
};

const sessionReducer = (state = defaultState, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return Object.assign(newState, {currentUserId: action.user.id});
        case LOGOUT_USER:
            return Object.assign(newState, {currentUserId: null});
        default:
            return state;
    }
};

export default sessionReducer;
