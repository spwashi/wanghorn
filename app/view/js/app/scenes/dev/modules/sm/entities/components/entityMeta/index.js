import React from "react";
import * as PropTypes from "prop-types"
import {getURI} from "../../../../../../../../path/resolution";
import {getNameFromSmID, getTitleFromPropName} from "../../../utility";
import {EntityConfigurationContainer} from "./components/configurationContainer";
import SmEntityMeta from "../../../../../../sm/components/meta";

class EntityMeta extends React.Component {
    render() {
        const {smID, config, schematic} = this.props;
        return (
            <SmEntityMeta config={config} schematic={config} actions={this.actions}>
                <EntityConfigurationContainer schematic={schematic} config={config || {}} />
            </SmEntityMeta>
        );
    }
    
    get actions() {
        const name = getNameFromSmID(this.props.smID);
        return {
            createModel: {
                title:      `Create New ${getTitleFromPropName(name)}`,
                uri:        getURI('dev--create_entity', {name}),
                canExecute: true
            },
        };
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