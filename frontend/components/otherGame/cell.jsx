import React from 'react';

class Cell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.status}>
                
            </div>
        );
    }
}

export default Cell;