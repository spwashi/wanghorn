import React from "react";
import * as PropTypes from "prop-types"
import {getURI} from "../../../../../../../path/resolution";
import {getNameFromSmID, getTitleFromPropName} from "../../../../../sm/utility";
import {EntityConfigurationContainer} from "./components/configurationContainer";
import SmEntityMeta from "../../../../../sm/components/meta";

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
        const name                = getNameFromSmID(this.props.smID);
        const formUriName         = `entity--${name}--create`;
        const fallbackFormUriName = `entity--create`;
        const uri                 = getURI(formUriName, {name}, {fallback: fallbackFormUriName});
        return {
            createModel: {
                title:      `Create New ${getTitleFromPropName(name)}`,
                uri,
                canExecute: true
            },
        };
    }
    
}

EntityMeta.propTypes = {
    smID:                  PropTypes.string,
    CONFIG:                PropTypes.object,
    entity:                PropTypes.object,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    onTogglePropertyClick: PropTypes.func,
    executeEntityQuery:    PropTypes.func,
};

export default EntityMeta;