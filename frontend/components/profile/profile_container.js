import { connect } from 'react-redux';
import { createPost, deletePost, fetchAllPosts } from '../../actions/post_actions';
import Profile from './profile';

const mapStateToProps = (state) => ({
    userId: state.session.currentUserId,
    user: state.entities.users[state.session.currentUserId],
    posts: Object.values(state.entities.posts)
});

const mapDispatchToProps = (dispatch) => ({
    createPost: (post) => dispatch(createPost(post)),
    deletePost: (id) => dispatch(deletePost(id)),
    fetchAllPosts: () => dispatch(fetchAllPosts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);