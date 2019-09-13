import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

import * as SessionApiUtil from './util/session_api_util';
import * as SessionActions from './actions/session_actions';
import * as PostActions from './actions/post_actions';

document.addEventListener("DOMContentLoaded", () => {

    let preloadedState = {};
    if (window.currentUser){
        preloadedState = {
            entities: {
                users: {
                    [window.currentUser.id]: {
                        id: window.currentUser.id,
                        username: window.currentUser.username,
                        rating: window.currentUser.rating,
                        status: 'waiting'
                    }
                }
            },
            errors: {
                session: []
            },
            session: {
                currentUserId: window.currentUser.id
            }
        };
    }
    const store = configureStore(preloadedState);

    //test BELOW
    window.fetchAllPosts = PostActions.fetchAllPosts;
    window.deletePost = PostActions.deletePost;

    window.signup = SessionApiUtil.signup;
    window.login = SessionApiUtil.login;
    window.logout = SessionApiUtil.logout;

    window.ReactLogin = SessionActions.login;
    window.ReactSignup = SessionActions.signup;
    window.ReactLogout = SessionActions.logout;

    window.getState = store.getState;
    window.dispatch = store.dispatch;
    //test ABOVE

    const root = document.getElementById("root");
    ReactDOM.render(<Root store={store} />, root);
});