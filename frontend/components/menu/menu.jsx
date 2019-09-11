import React from 'react';

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Welcome, {this.props.user.username}
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