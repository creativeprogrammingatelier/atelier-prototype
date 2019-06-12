import React, { Component } from "react";
import SubmittedOverviewTable from "./Components/SubmittedOverviewTable";

class TAView extends Component {
    render() {
        return (
            <div>
                <h2>Welcome, TA</h2>
                <SubmittedOverviewTable />
            </div>
        )
    }
}

export default TAView;