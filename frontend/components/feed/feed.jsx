import React from 'react';
import CreatePostContainer from './create_post/create_post_container';

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
                <CreatePostContainer />
                {
                    posts.map( (post, idx) => {
                        return (
                            <div className="post_box" key={idx}>
                                <div className="post_header">
                                    <div className="post_heading">
                                        <div className="time_stamp">
                                            <i>{post.created_at.slice(0, 10)}</i>
                                        </div>
                                        <i className="fas fa-comment"></i>
                                        {post.author} ({post.author_rating}):
                                    </div>
                                </div>
                                <div className="post_content">
                                    {post.content}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default Feed;