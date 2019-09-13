import React from 'react';

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="menu">
                Welcome, {this.props.user.username} ({this.props.user.rating})
                <br/>
                Home
                <br/>
                Play
                <br/>
                <button onClick={this.props.logout}>Log Out</button>
            </div>
        );
    }
}

export default Menu;