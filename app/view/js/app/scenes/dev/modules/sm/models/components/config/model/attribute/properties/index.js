import React from "react";
import * as PropTypes from "prop-types"
import ModelConfigurationAttribute from "../index";
import PropertiesAttrMetaList from "./metaList";
import PropertyConfigurationWrapper from "../../../property/config/wrapper";
import {normalizeSmID} from "../../../../../../../sm/utility";

class ModelConfigurationPropertiesAttribute extends React.Component {
    get meta() {
        const {properties, onPropertyLinkTrigger, activeProperties} = this.props;
        return <PropertiesAttrMetaList onPropertyLinkTrigger={onPropertyLinkTrigger} activeProperties={activeProperties} properties={properties} />
    }
    
    render() {
        return (
            <ModelConfigurationAttribute valueMeta={this.meta} attribute="properties">
                <div className="attribute__properties--container">
                    {
                        Object.entries(this.props.properties)
                              .filter(([name, {smID: propertySmID}]) => this.props.activeProperties.indexOf(normalizeSmID(propertySmID)) > -1)
                              .map(([name, config]) => <PropertyConfigurationWrapper key={name} {...{name, config}} />)
                    }
                </div>
            </ModelConfigurationAttribute>
        );
        
    }
}

ModelConfigurationPropertiesAttribute.propTypes    = {
    properties:            PropTypes.object,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    onPropertyLinkTrigger: PropTypes.func
};
ModelConfigurationPropertiesAttribute.defaultProps = {
    activeProperties: []
};
export default ModelConfigurationPropertiesAttribute;