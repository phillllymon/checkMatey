import { connect } from 'react-redux';
import { fetchAllPosts, createPost, updatePost } from '../../actions/post_actions';
import OtherGameMobile from './other_game_mobile.jsx';

const mapStateToProps = (state) => ({
    allPosts: state.entities.posts
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllPosts: () => dispatch(fetchAllPosts()),
    createPost: (post) => dispatch(createPost(post)),
    updatePost: (post) => dispatch(updatePost(post))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherGameMobile);