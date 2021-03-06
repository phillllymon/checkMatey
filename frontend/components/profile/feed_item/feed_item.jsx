import React from 'react';
import { stringToDescription, stringToTitle } from '../../../util/chess_util';
import ChessTableContainer from '../../chess_table/chess_table_container';
import { Redirect } from 'react-router-dom';

class FeedItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post,
            content: this.props.post.content,
            mode: 'display'
        };

        if (this.state.post.type === 'sequence') {
            this.setState({content: 'This User Posted a Sequence'});
        }

        this.editBar = this.editBar.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.editPost = this.editPost.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.buttonSpaces = this.buttonSpaces.bind(this);
        this.showSeq = this.showSeq.bind(this);
        this.seeSeq = false;
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow(e) {
        this.seeSeq = this.seeSeq ? false : true;
        this.setState({});
    }

    showSeq() {
        
        return (
            <div>
                <Redirect to={{
                    pathname: '/show',
                    state: { post: this.props.post }
                }} />
            </div>
        );
    }

    buttonSpaces() {
        let answer = [];
        for (let i = 0; i < 64; i++){
            if (Math.floor(i/8) % 2 === 0){
                answer.push(i % 2 === 0 ? 'w' : 'b');
            }
            else {
                answer.push(i % 2 === 0 ? 'b' : 'w');
            }
        }
        return answer;
    }

    updatePost(e) {
        let post = Object.assign(this.props.post, {content: this.state.content});
        this.props.updatePost(post);
        this.setState({mode: 'display'});
    }

    handleInput(e) {
        this.setState({content: e.target.value});
    }

    deletePost(e) {
        this.props.deletePost(this.props.post.id);
    }

    editPost(e) {
        this.setState({mode: 'edit'});
    }

    editBar() {
        if (this.props.post.post_type === 'plain'){
            if (this.state.mode === 'display'){
                return (
                    <div className="edit_bar">
                        <button className="edit_button" onClick={this.editPost}>edit</button>
                        <button className="edit_button" onClick={this.deletePost}>delete</button>
                    </div>
                );
            }
            else {
                return (
                    <div className="edit_bar">
                        <button className="edit_button" onClick={this.updatePost}>save changes</button>
                    </div>
                );
            }
        }
        else {
            return (
                <div className="edit_bar">
                    <button className="edit_button" onClick={this.deletePost}>delete</button>
                </div>
            );
        }
    }

    render() {
        let post = this.props.post;
        if (post.post_type === 'plain') {
            if (this.state.mode === 'display'){
                return (
                    <div className="post_box">
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
                            {((this.props.currentUserId).toString() === (post.author_id).toString()) || ((this.props.currentUserId).toString() === 'admin') ? this.editBar() : ''}
                            {post.content}
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className="post_box">
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
                            {(this.props.currentUserId).toString() === (post.author_id).toString() ? this.editBar() : ''}
                            <textarea
                                type="text"
                                className="edit_box"
                                value={this.state.content}
                                onChange={this.handleInput}
                            />
                            
                        </div>
                    </div>
                );
            }
        }
        else if (post.post_type === 'sequence'){
            let description = stringToDescription(this.props.post.content);
            let title = stringToTitle(this.props.post.content);
            return (
                <div className="post_box">
                    {this.seeSeq ? this.showSeq() : ''}
                    <div className="post_header">
                        <div className="post_heading">
                            <div className="time_stamp">
                                <i>{post.created_at.slice(0, 10)}</i>
                            </div>
                            <i className="fas fa-comment"></i>
                            {post.author} ({post.author_rating}) shared a sequence:
                        </div>
                    </div>
                    <div className="post_content">
                        {(this.props.currentUserId).toString() === (post.author_id).toString() ? this.editBar() : ''}
                        <div className="seeSeqButton">
                            <div className="seeSeqTriangle" onClick={this.toggleShow}>
                                <i className="fas fa-play"></i>
                            </div>
                            {
                                this.buttonSpaces().map( (color, idx) => {
                                    return (
                                        <div key={idx} className={color + " tiny"}></div>
                                    );
                                })
                            }
                        </div>
                        <div className="seq_title">{title}</div>
                        <br/>
                        {description}
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
}

export default FeedItem;