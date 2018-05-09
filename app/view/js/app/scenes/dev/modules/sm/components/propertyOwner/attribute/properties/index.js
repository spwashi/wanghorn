import React from "react";
import * as PropTypes from "prop-types"
import PropertiesAttrMetaList from "./metaList";
import PropertyConfigurationWrapper from "../../property/config/wrapper";
import {normalizeSmID} from "../../../../utility";
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";

class SmEntityConfigurationPropertiesAttribute extends React.Component {
    get meta() {
        const {properties, onPropertyLinkTrigger, activeProperties} = this.props;
        return <PropertiesAttrMetaList onPropertyLinkTrigger={onPropertyLinkTrigger} activeProperties={activeProperties} properties={properties} />
    }
    
    render() {
        return (
            <ConfigurationAttribute valueMeta={this.meta} ownerType={this.props.ownerType} attribute="properties">
                <div className="attribute__properties--container">
                    {
                        Object.entries(this.props.properties)
                              .filter(([name, {smID: propertySmID}]) => this.props.activeProperties.indexOf(normalizeSmID(propertySmID)) > -1)
                              .map(([name, config]) => <PropertyConfigurationWrapper key={name} {...{name, config}} />)
                    }
                </div>
            </ConfigurationAttribute>
        );
        
    }
}

SmEntityConfigurationPropertiesAttribute.propTypes    = {
    properties:            PropTypes.object,
    ownerType:             PropTypes.string,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    onPropertyLinkTrigger: PropTypes.func
};
SmEntityConfigurationPropertiesAttribute.defaultProps = {
    activeProperties: []
};
export default SmEntityConfigurationPropertiesAttribute;