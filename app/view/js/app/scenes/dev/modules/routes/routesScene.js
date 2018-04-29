import React from "react"
import {DevScene} from "../../components/scene";
import {ActiveComponent} from "../../components/selectivelyActive/components";
import {selectRoutes, selectRouteSceneActivity} from "./selector";
import {fetchRoutes, toggleRouteScene} from "./actions";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {ActiveRoutesScene} from "./components/active";

function mapState(state) {
    const routes = selectRoutes(state);
    return {routes, isActive: selectRouteSceneActivity(state)};
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  fetchRoutes,
                                  toggleRouteScene,
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
                         isActive={this.props.isActive}
                         onActivate={this.props.toggleRouteScene}
                         onDeactivate={this.props.toggleRouteScene}
                         childClassName={"dev--component route--container"}>
            <ActiveComponent component={ActiveRoutesScene} {...this.props} />
        </DevScene>
    }
}