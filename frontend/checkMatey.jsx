import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import configureStore from './store/store';

import * as SessionApiUtil from './util/session_api_util';

document.addEventListener("DOMContentLoaded", () => {

    const store = configureStore();

    //test BELOW
    window.signup = SessionApiUtil.signup;
    window.login = SessionApiUtil.login;
    window.logout = SessionApiUtil.logout;

    window.getState = store.getState;
    window.dispatch = store.dispatch;
    //test ABOVE

    const root = document.getElementById("root");
    ReactDOM.render(<App store={store} />, root);
});