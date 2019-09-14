import { connect } from 'react-redux';
import { updatePost, deletePost } from '../../../actions/post_actions';
import FeedItem from './feed_item';

const mapStateToProps = (state, ownProps) => ({
    post: ownProps.post,
    currentUserId: state.session.currentUserId
});

const mapDispatchToProps = (dispatch) => ({
    updatePost: (post) => dispatch(updatePost(post)),
    deletePost: (id) => dispatch(deletePost(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);