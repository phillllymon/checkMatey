import { connect } from 'react-redux';
import { createPost } from '../../../actions/post_actions';
import CreatePost from './create_post';

const mapStateToProps = (state) => ({
    post: {content: ''}
});

const mapDispatchToProps = (dispatch) => ({
    createPost: (post) => dispatch(createPost(post))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);