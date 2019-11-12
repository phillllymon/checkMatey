import React from 'react';
import CreatePostContainer from './create_post/create_post_container';
import FeedItemContainer from './feed_item/feed_item_container';

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts
        };
    }

    componentDidMount() {   
        this.props.fetchAllPosts();
    }

    render() {
        let posts = this.props.posts.reverse();
        
        return (
            <div className="feed">
                <div className="controls_heading  better_color" style={{ 'height': '42px' }}>
                    <div style={{ 'margin': '10px' }}>
                        <i className="fas fa-comments"></i> Community Forum
                    </div>
                </div>
                <CreatePostContainer />
                
                {
                    posts.map( (post, idx) => {
                        return (
                            <div key={idx}>
                                <FeedItemContainer post={post}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default Feed;