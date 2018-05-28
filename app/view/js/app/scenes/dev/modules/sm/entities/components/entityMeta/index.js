import React from "react";
import {Route} from "react-router-dom";
import * as PropTypes from "prop-types"
import {getURI} from "../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../utility";
import {EntityActions} from "./components/entityActions";
import {EntityConfigurationContainer} from "./components/configurationContainer";
import {CreateEntityDialog} from "./components/createEntityDialog";

class EntityMeta extends React.Component {
    render() {
        const {smID, config, entity}  = this.props;
        const {activeProperties}      = this.props;
        const {onTogglePropertyClick} = this.props;
        const createEntityURI         = getURI('dev--create_entity', {name: getNameFromSmID(smID)});
        
        return (
            <div key={smID} className={"smEntity--meta"}>
                <header>
                    <h3 id={smID} className={"title smEntity--smID"}>{smID}</h3>
                </header>
                <EntityActions createEntityURI={createEntityURI} />
                <div className="wrapper component--wrapper smEntity--component--wrapper">
                    <EntityConfigurationContainer entity={entity}
                                                  config={config || {}}
                                                  onTogglePropertyClick={onTogglePropertyClick}
                                                  activeProperties={activeProperties} />
                </div>
                <Route path={getURI('dev--create_entity', null, {skipEmpty: true, asReactRoute: true})}
                       component={({history}) => <CreateEntityDialog smID={smID} schematic={entity} history={history} />} />
            </div>
        );
    }
}

EntityMeta.propTypes = {
    smID:                  PropTypes.string,
    config:                PropTypes.object,
    entity:                PropTypes.object,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    onTogglePropertyClick: PropTypes.func,
    executeEntityQuery:    PropTypes.func,
};

export default EntityMeta;