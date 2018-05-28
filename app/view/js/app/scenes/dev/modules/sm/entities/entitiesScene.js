import React, {Component} from "react";
import {bindActionCreators} from 'redux'
import {executeEntityQuery, fetchEntityMetas, toggleEntityScene} from "./actions";
import {connect} from "react-redux";
import {InactiveDevComponent} from "../../../components/scene";
import {Route, Switch} from "react-router"
import ActiveEntityScene from "./components/scene/active";
import {selectAllEntityMetaObjects, selectEntityDevInterface, selectEntitySceneActivity} from "./selector";
import {getURI} from "../../../../../../path/resolution";
import {LinkItem} from "../../../../../../components/navigation";

@connect(mapState, mapDispatch)
class EntitiesScene extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.fetchEntityMetas()
    }
    
    render() {
        return (
            <div className={`scene--wrapper dev--scene--wrapper smEntity--scene--wrapper`}>
                <Switch>
                    <Route path={getURI('dev--entities')}
                           component={
                               props =>
                                   <div className={`scene dev--scene smEntity--scene dev--component--wrapper`}>
                                       <ActiveEntityScene {...this.props} />
                                   </div>
                           } />
                    <Route>
                        <LinkItem to={getURI('dev--entities')} isButton={true}>
                            <InactiveDevComponent title={'Entities'} className={'dev--scene inactive smEntity--container'} />
                        </LinkItem>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default EntitiesScene;

function mapState(state) {
    const entities       = selectAllEntityMetaObjects(state) || {};
    const isActive       = selectEntitySceneActivity(state);
    const entityState    = selectEntityDevInterface(state);
    const allEntitySmIDs = entityState.list || [];
    return {entities, isActive, allEntitySmIDs};
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  toggleEntityScene,
                                  fetchEntityMetas,
                                  executeEntityQuery
                              }, dispatch);
}