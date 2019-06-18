import React, { Component } from "react";
import Prism from "prismjs";
import "../stylesheets/prism.css";

class PDEReader extends React.Component {

    constructor() {
        super();
        this.state = {
            PDEReaderURL: '',
            code: ''
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.file !== this.props.file) {
            // Should do code highlighting, not sure why it's not working
            Prism.highlightAll();

            // Gets url as prop from clicked link in StudentView
            const url = this.props.file
            fetch(url, {
                method: 'GET',
                mode: 'cors'
            }).then(response => {
                console.log(response)
                response.text().then((text) => {
                    this.setState({
                        PDEReaderURL: url,
                        code: text,
                    })
                })
            })
        }
    }

    render() {
        return (
            <div>
                <pre className="line-numbers">
                    <code className="language-processing">
                        {this.state.code}
                    </code>
                </pre>
            </div>
        );
    }
}

export default PDEReader;