import React from 'react';

class CellMobile extends React.Component {
    constructor(props) {
        super(props);
        this.getMobileClassName = this.getMobileClassName.bind(this);
    }

    getMobileClassName(status) {
        return status + "_mobile";
    }

    render() {
        return (
            <div className={this.getMobileClassName(this.props.status)}>
                
            </div>
        );
    }
}

export default CellMobile;