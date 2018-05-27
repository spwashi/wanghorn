import React from "react"
import {InactiveDevComponent} from "../../components/scene";
import {selectRoutes, selectRouteSceneActivity} from "./selector";
import {fetchRoutes, toggleRouteScene} from "./actions";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {Route, Switch} from "react-router"
import {ActiveRoutesScene} from "./components/active";
import {getURI} from "../../../../../path/resolution";
import {LinkItem} from "../../../../../components/navigation";

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
        return <div className={`scene--wrapper dev--scene--wrapper route--scene--wrapper`}>
            <Switch>
                <Route path={getURI('dev--routes')}
                       component={
                           props =>
                               <div className={`scene dev--scene route--scene dev--component--wrapper`}>
                                   <ActiveRoutesScene {...this.props} />
                               </div>
                       } />
                <Route>
                    <LinkItem to={getURI('dev--routes')} isButton={true}>
                        <InactiveDevComponent title={'Routes'} className={'dev--scene inactive route--container'} />
                    </LinkItem>
                </Route>
            </Switch>
        </div>
    }
}