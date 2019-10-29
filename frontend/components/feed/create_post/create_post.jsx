import React from 'react';

class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.post.content
        };
        this.updateContent = this.updateContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateContent(e) {
        this.setState({content: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.createPost({content: this.state.content, post_type: "plain"});
        this.setState({content: ''});
    }

    render() {
        return (
            <div className="post_box">
                <div className="post_header">
                    <div className="post_heading">
                        <i className="fas fa-comment-medical"></i>
                        What say you?
                    </div>   
                </div>
                <div className="post_content">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            id="new_post"
                            className="content_box"
                            type="text"
                            value={this.state.content}
                            placeholder="Add your two cents..."
                            onChange={this.updateContent}
                        />
                        <button
                            className={this.state.content.length > 0 ? "active_button" : "post_button"}
                            type="submit"
                            disabled={this.state.content.length > 0 ? "" : "disabled"}
                        >Post</button>
                    </form>
                </div>
            </div>
        );
    }

}

export default CreatePost;