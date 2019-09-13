import { connect } from 'react-redux';
import { createPost, deletePost, fetchAllPosts } from '../../actions/post_actions';
import Feed from './feed';

const mapStateToProps = (state) => ({
    posts: Object.values(state.entities.posts)
});

const mapDispatchToProps = (dispatch) => ({
    createPost: (post) => dispatch(createPost(post)),
    deletePost: (id) => dispatch(deletePost(id)),
    fetchAllPosts: () => dispatch(fetchAllPosts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);