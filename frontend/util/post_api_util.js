export const createPost = (post) => {
    return $.ajax({
        url: `/api/posts`,
        method: 'POST',
        data: { post: post }
    });
};

export const updatePost = (post) => {
    return $.ajax({
        url: `/api/posts/${post.id}`,
        method: 'PATCH',
        data: { post: post }
    });
};

export const fetchPosts = () => {
    return $.ajax({
        url: `/api/posts`,
        method: 'GET'
    });
};

export const fetchPost = (id) => {
    return $.ajax({
        url: `/api/posts/${id}`,
        method: 'GET'
    });
};

export const deletePost = (id) => {
    return $.ajax({
        url: `api/posts/${id}`,
        method: 'DELETE'
    });
};