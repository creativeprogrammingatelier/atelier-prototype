import React, { Component } from "react";
import FileUploader from 'react-firebase-file-uploader'
import firebase from './firebase.js'
import PDEReader from './Components/PDEReader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment';
library.add(faEye)

class StudentView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: '',
            fileURL: '',
            progress: 0,
            items: [],
            viewedFileURL: '',
            viewFileName: '',
            viewingCode: false,
            sNum: ''
        }

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    // sNum = 's1234569'
    sNum = 's1'
    storageRef = firebase.storage().ref(this.sNum);
    userFilesRef = firebase.firestore().collection('users').doc(this.sNum).collection('codeFileRefs')
    usersRef = firebase.firestore().collection('users').doc(this.sNum)

    componentWillMount() {
        this.setState({
            sNum: this.sNum,
        })

        //List all items of the user, according to the references in firestore
        this.userFilesRef.onSnapshot(querySnapshot => {
            var items = querySnapshot.docs.map(function (documentSnapshot) {
                return documentSnapshot.data();
            });
            const newState = [];
            for (let item in items) {
                newState.push({
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

    }

    handleUploadStart = () => {
        this.setState({
            progress: 0
        })
    }

    handleProgress = progress => this.setState({ progress });

    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };

    handleUploadSuccess = filename => {

        // If a document for this user does not exist yet, create it
        this.usersRef.set({ snum: true }, { merge: true })

        this.setState({
            filename: filename,
            progress: 100
        })
        // Add a reference to this file in the database
        this.storageRef.child(filename).getDownloadURL()
            .then(url => {
                this.setState({
                    fileURL: url
                })
                this.userFilesRef.add({
                    filename: filename,
                    fileURL: url,
                    timestamp: Date.now()
                })
            })
    }

    // This state change is passed to the PDEReader
    handleLinkClick = (e, fileURL, title) => {
        this.setState({
            viewedFileURL: fileURL,
            viewFileName: title,
            viewingCode: true
        })
    }

    render() {
        return (
            <div>
                <h2>Welcome, {this.state.sNum}</h2>
                <label style={{ padding: 10, borderRadius: 4, pointer: 'cursor' }}>
                    <FileUploader
                        name='file'
                        storageRef={this.storageRef}
                        onUploadStart={this.handleUploadStart}
                        onUploadSuccess={this.handleUploadSuccess}
                        onUploadError={this.handleUploadError}
                        onProgress={this.handleProgress}
                    /> </label>

                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">File name</th>
                                <th scope="col">Download</th>
                                <th scope="col">Uploaded</th>
                                <th scope="col">Feedback received</th>
                                <th scope="col">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.title}</td>
                                        <td><a href={item.fileURL}>Download link</a></td>
                                        <td><Moment format="YYYY/MM/DD">{item.timestamp}</Moment></td>
                                        <td><Moment format="YYYY/MM/DD">{item.timestamp}</Moment></td>
                                        <td><FontAwesomeIcon icon="eye" onClick={(e) => this.handleLinkClick(e, item.fileURL, item.title)} /></td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>

                </div>
                {this.state.viewingCode &&
                            <PDEReader
                            file={this.state.viewedFileURL}
                            name={this.state.viewFileName}
                            type='student'
                        />        
                }

            </div>
        )
    }
}

export default StudentView;