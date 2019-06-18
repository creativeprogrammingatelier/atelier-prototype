import React, { Component } from "react";

class PDEReader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                {this.props.file}
            </div>
        );
    }
}

export default PDEReader;