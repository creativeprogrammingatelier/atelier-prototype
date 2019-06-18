import React, { Component } from "react";
import "../stylesheets/prism.css";

class PDEReader extends React.Component {

    constructor() {
        super();
        this.state = {
            code: ''
        }
    }

    componentDidMount = () => {
        Prism.highlightAll();

        const path = require("../Circle.pde")
        fetch(path).then(response => {
            response.text().then((text) => {
                console.log(text)
                this.setState({
                    code: text,
                })
            })
        })
    }

    render() {
        return (
            <div>
                {/* <div>
                    {this.props.file}
                </div> */}
                <pre>
                    <code className="language-processing">
                    {this.state.code}
                        {/* {this.state.code} */}
                    </code>
                </pre>
            </div>
        );
    }
}

export default PDEReader;