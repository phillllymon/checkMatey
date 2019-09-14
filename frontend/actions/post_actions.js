import * as PostApiUtil from '../util/post_api_util';

export const RECEIVE_ALL_POSTS = 'RECEIVE_ALL_POSTS';
export const RECEIVE_POST = 'RECEIVE_POST';
export const REMOVE_POST = 'REMOVE_POST';

export const receiveAllPosts = (posts) => {
    return {
        type: RECEIVE_ALL_POSTS,
        posts: posts
    };
};

export const receivePost = (post) => {
    return {
        type: RECEIVE_POST,
        post: post
    };
};

export const removePost = (id) => {
    return {
        type: REMOVE_POST,
        id: id
    };
};

export const fetchAllPosts = () => {
    return (dispatch) => {
        PostApiUtil.fetchPosts()
        .then( (res) => dispatch(receiveAllPosts(res)));
    };
};

export const createPost = (post) => {
    return (dispatch) => {
        PostApiUtil.createPost(post)
        .then( (res) => dispatch(receivePost(res)));
    };
};

export const updatePost = (post) => {
    return (dispatch) => {
        PostApiUtil.updatePost(post)
        .then( (res) => dispatch(receivePost(res)))
    };
};

export const deletePost = (id) => {
    return (dispatch) => {
        PostApiUtil.deletePost(id)
        .then( (res) => dispatch(removePost(res)));
    };
};
