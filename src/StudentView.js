import React, { Component } from "react";
import FileUploader from 'react-firebase-file-uploader'
import firebase from './firebase.js'  

class StudentView extends Component {

    state = {
        file: '',
        fileURL: '',
        progress: 0,
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
        this.setState({
            image: filename,
            progress: 100
        })
        firebase.storage().ref('code').child(filename).getDownloadURL()
        .then(url => this.setState({
            fileURL: url
        }))
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <h2>Welcome, student</h2>
                <FileUploader
                    name='file'
                    storageRef={firebase.storage().ref('code')}
                    onUploadStart={this.handleUploadStart}
                    onUploadSuccess={this.handleUploadSuccess}
                    onUploadError={this.handleUploadError}
                    onProgress={this.handleProgress}
                />
            </div>
        )
    }
}

export default StudentView;