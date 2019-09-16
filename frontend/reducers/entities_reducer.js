import { combineReducers } from 'redux';
import usersReducer from './users_reducer';
import postsReducer from './posts_reducer';
import gamesReducer from './games_reducer';

const entitiesReducer = combineReducers({
    users: usersReducer,
    posts: postsReducer,
    currentGame: gamesReducer
});

export default entitiesReducer;