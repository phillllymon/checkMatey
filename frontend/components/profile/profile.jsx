import React from 'react';
import CreatePostContainer from './create_post/create_post_container';
import FeedItemContainer from './feed_item/feed_item_container';
import GameItem from './game_item';

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.games = [];
        this.state = {
            posts: this.props.posts,
            games: []
        };
    }

    componentDidMount() {   
        this.props.fetchAllPosts();
        $.ajax({
            url: `/api/games/${this.props.userId}`,
            method: 'GET'
        }).then((res) => {
            //this.setState({games: Object.values(res)});
            this.games = Object.values(res);
        });
    }

    render() {
        let posts = this.props.posts.reverse();
        
        return (
            <div className="feed">
                <div className="profile">
                    <div className="profile_heading">
                        <i className="fas fa-user" style={{'marginRight': '10px'}}></i>
                        {this.props.user.username}
                    </div>
                    <div className="profile_content">
                        Current Rating: {this.props.user.rating}
                        <br/>
                        Games to date: {this.games.length}
                        <br/>
                        Game History:
                        <br/>
                        {
                            this.games.length === 0 ? '(no games to show)' : this.games.map( (game, idx) => {
                                return (
                                    <div key={idx}>
                                        
                                        <GameItem game={game}/>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="profile_heading">
                        <i className="fas fa-comment" style={{ 'marginRight': '10px' }}></i>
                        Your Posts:
                    </div>
                </div>

                {
                    posts.map( (post, idx) => {
                        if (post.author === this.props.user.username){
                            return (
                                <div key={idx}>
                                    <FeedItemContainer post={post} />
                                </div>
                            );
                        }
                        else {
                            return (
                                ''
                            );
                        }
                    })
                }
            </div>
        );
    }
}

export default Feed;