import React from "react"
import {DevScene} from "../../components/scene";
import {ActiveComponent} from "../../components/selectivelyActive/components";
import {selectRoutes} from "./selector";
import {fetchRoutes} from "./actions";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {ActiveRoutesScene} from "./components/active";

function mapState(state) {
    const routes = selectRoutes(state);
    return {routes};
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  fetchRoutes,
                              }, dispatch);
}

@connect(mapState, mapDispatch)
export class RoutesScene extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.fetchRoutes();
    }
    
    render() {
        return <DevScene className={"routes"}
                         title={"Routes"}
                         childClassName={"dev--component route--container"}>
            <ActiveComponent component={ActiveRoutesScene} {...this.props} />
        </DevScene>
    }
}