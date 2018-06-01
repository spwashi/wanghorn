import React from "react";
import {Route} from "react-router-dom"
import * as PropTypes from "prop-types"
import PropertiesAttrMetaList from "./metaList";
import {ConfigurationAttribute} from "../../../configuration/index";
import {getReactPath} from "../../../../../../../path/resolution";
import PropertyConfiguration from "../../../../modules/properties/components/configuration/index";

class SmEntityConfigurationPropertiesAttribute extends React.Component {
    get meta() {
        const {properties, onPropertyLinkTrigger, activeProperties} = this.props;
        return <PropertiesAttrMetaList onPropertyLinkTrigger={onPropertyLinkTrigger} activeProperties={activeProperties} properties={properties} />
    }
    
    render() {
        const properties  = this.props.properties;
        const propertyURI = getReactPath(`dev--${this.props.ownerType}--property`);
        return (
            <ConfigurationAttribute valueMeta={this.meta} ownerType={this.props.ownerType} attribute="properties">
                <div className="attribute__properties--container">
                    <Route path={propertyURI}
                           component={props => {
                               let params   = (props.match || {}).params || {};
                               const name   = params.property;
                               const config = properties[name];
                               return <PropertyConfiguration className={"active"}
                                                             name={name}
                                                             config={{name, ...config}} />;
                           }} />
                </div>
            </ConfigurationAttribute>
        );
        
    }
}

SmEntityConfigurationPropertiesAttribute.propTypes    = {
    properties:            PropTypes.object,
    ownerType:             PropTypes.string.isRequired,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    onPropertyLinkTrigger: PropTypes.func
};
SmEntityConfigurationPropertiesAttribute.defaultProps = {
    activeProperties: []
};
export default SmEntityConfigurationPropertiesAttribute;