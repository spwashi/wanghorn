import React from "react"
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {Route, withRouter} from 'react-router-dom'
import * as PropTypes from "prop-types"
import {selectSmSchematics} from "./selector";
import {markContextResolved} from "./actions/index";
import {getReactPath, getURI} from "../../../path/resolution";
import {CreateSmEntityDialog} from "./components/form/creation/components/dialog";
import {fetchModelMetas} from "./modules/models/actions/index";
import {fetchEntityMetas} from "./modules/entities/actions/actions";
import {fetchSmEntities, fetchSmEntitySchematic} from "./actions";
import {getSmEntityManagerFormats} from "./utility";

@connect(mapState, mapDispatch)
class SmScene extends React.Component {
    static propTypes = {resolveSmEntities: PropTypes.func, resolveSmEntitySchematic: PropTypes.func};
    
    componentDidMount() {
        this.props.fetchModelMetas();
        this.props.fetchEntityMetas();
    }
    
    render() {
        
        const modelCreationRoute  = this.renderSmEntityCreationRoute('Model');
        const entityCreationRoute = this.renderSmEntityCreationRoute('Entity');
        return (
            <div>
                {modelCreationRoute}
                {entityCreationRoute}
            </div>
        );
    }
    
    renderSmEntityCreationRoute(ownerType) {
        
        const {
                  lowercase: ownerType_lowercase,
                  managerName,
                  plural
              } = getSmEntityManagerFormats(ownerType);
        
        const SmEntityCreationDialog = ({history, match}) => {
            const name = match.params.name;
            const smID = `${managerName}${name}`;
            
            const formReceiveUriName  = `${ownerType_lowercase}--${name}--create--receive`;
            const fallbackReceiveName = `${ownerType_lowercase}--create--receive`;
            const navigateURI         = getURI(formReceiveUriName, {name}, {fallback: fallbackReceiveName});
            
            const ownerType_plural__lc = plural ? plural.toLowerCase() : plural;
            
            const schematics = this.props.schematics[ownerType_plural__lc] || {};
            if (!schematics) return ' ...loading';
            const schematic = schematics[smID];
            return <CreateSmEntityDialog smID={smID} formUrl={navigateURI} schematic={schematic} history={history} />;
        };
        
        const routeURI = getReactPath(`${ownerType_lowercase}--create`);
        return <Route path={routeURI} component={SmEntityCreationDialog} />;
    }
}

SmScene = withRouter(SmScene);
export {SmScene};
function mapState(state) {
    const schematics = selectSmSchematics(state);
    const smEntities = {};
    return {schematics};
}
function mapDispatch(dispatch) {
    const actions = {
        markContextResolved,
        fetchModelMetas,
        fetchEntityMetas,
        fetchSmEntities:        fetchSmEntities,
        fetchSmEntitySchematic: fetchSmEntitySchematic
    };
    return bindActionCreators(actions, dispatch);
}