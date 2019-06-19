import React, { Component } from "react";
import Prism from "prismjs";
import "../stylesheets/prism.css";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faCommentAlt)


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
            <Card>
                <Card.Header as="h5">{this.props.name}
                    <span className='comment-span'>
                        <Button variant='dark'>
                            <FontAwesomeIcon icon='comment-alt' />
                            &nbsp;&nbsp; {this.props.type=='TA' ? 'Add comments' : 'View comments'}
                        </Button>
                    </span>
                </Card.Header>
                <pre className="line-numbers">
                    <code className="language-processing">
                        {this.state.code}
                    </code>
                </pre>
            </Card>
        );
    }
}

export default PDEReader;