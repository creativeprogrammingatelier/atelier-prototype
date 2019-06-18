import React, { Component } from "react";
import firebase from './firebase.js'
import PDEReader from './Components/PDEReader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment';
library.add(faEye)

class TAView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: '',
            fileURL: '',
            items: [],
            viewedFileURL: '',
        }

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    storageRef = firebase.storage();
    dbRef = firebase.firestore().collection('users')

    componentWillMount() {
        const newState = [];
        this.dbRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                let userFilesRef = firebase.firestore().collection('users').doc(doc.id).collection('codeFileRefs')
                userFilesRef.onSnapshot(querySnapshot => {
                    var items = querySnapshot.docs.map(function (documentSnapshot) {
                        return documentSnapshot.data();
                    });
                    for (let item in items) {
                        newState.push({
                            sNum: doc.id,
                            id: item,
                            title: items[item].filename,
                            fileURL: items[item].fileURL,
                            timestamp: items[item].timestamp
                        });
                    }
                    this.setState({
                        items: newState,
                    })
                });
            });
        });
    }

    // This state change is passed to the PDEReader
    handleLinkClick = (e, fileURL) => {
        this.setState({
            viewedFileURL: fileURL,
        })
    }

    render() {
        return (
            <div>
                <div>
                    <h2>Welcome, TA</h2>
                </div>

                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Student number</th>
                                <th scope="col">File name</th>
                                <th scope="col">Download</th>
                                <th scope="col">Uploaded</th>
                                <th scope="col">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.sNum}</td>
                                        <td>{item.title}</td>
                                        <td><a href={item.fileURL}>Download link</a></td>
                                        <td><Moment>{item.timestamp}</Moment></td>
                                        <td><FontAwesomeIcon icon="eye" onClick={(e) => this.handleLinkClick(e, item.fileURL)} /></td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>
                </div>

                <PDEReader file={this.state.viewedFileURL} />

            </div>




        )
    }
}

export default TAView;