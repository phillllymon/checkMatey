import * as SessionApiUtil from '../util/session_api_util';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';

export const receiveCurrentUser = (user) => {
    return {
        type: RECEIVE_CURRENT_USER,
        user: user
    };
};

export const logoutUser = () => {
    return {
        type: LOGOUT_USER
    };
};

export const receiveErrors = (errors) => {
    return {
        type: RECEIVE_ERRORS,
        errors: errors
    };
};

export const receiveSessionErrors = (errors) => {
    return {
        type: RECEIVE_SESSION_ERRORS,
        errors: errors
    };
};

export const login = (user) => {
    return (dispatch) => {
        SessionApiUtil.login(user)
        .then( (res) => dispatch(receiveCurrentUser(res)))
        .fail( (res) => dispatch(receiveSessionErrors(res.responseJSON)));
    };
};

export const logout = () => {
    return (dispatch) => {
        SessionApiUtil.logout()
        .then( (res) => dispatch(logoutUser(res)));
    };
};

export const signup = (user) => {
    return (dispatch) => {
        SessionApiUtil.signup(user)
        .then( (res) => dispatch(receiveCurrentUser(res)))
        .fail( (res) => dispatch(receiveSessionErrors(res.responseJSON)));
    };
};

