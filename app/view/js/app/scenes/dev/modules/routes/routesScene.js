import React from "react"
import {DevScene} from "../../components/scene";
import {ActiveComponent} from "../../components/selectivelyActive/components";

class ActiveRoutesScene extends React.Component {
    render() {
        return (
            <div className="routes--container" ref={this.props.activeElRef}>
                <h2 className={`title routes--container--title`}>Routes</h2>
            </div>
        )
    }
}

export class RoutesScene extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return <DevScene className={"routes"}
                         title={"Routes"}
                         childClassName={"route--container"}>
            <ActiveComponent component={ActiveRoutesScene} {...this.props} />
        </DevScene>
    }
}