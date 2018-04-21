import React from "react"
import * as PropTypes from "prop-types"
import ModelConfigurationAttribute from "../index";
import PropertiesAttrMetaList from "./metaList";
import PropertyConfigurationWrapper from "../../../property/config/wrapper";

class ModelConfigurationPropertiesAttribute extends React.Component {
    get meta() {
        const {properties, onPropertyLinkTrigger} = this.props;
        return <PropertiesAttrMetaList onPropertyLinkTrigger={onPropertyLinkTrigger} properties={properties} />
    }
    
    render() {
        return (
            <ModelConfigurationAttribute valueMeta={this.meta} attribute="properties">
                <div className="model--configuration--attribute--container attribute__properties--container">
                    {
                        Object.entries(this.props.properties)
                              .map(([name, config]) =>
                                       <PropertyConfigurationWrapper key={name} name={name} config={config} />)
                    }
                </div>
            </ModelConfigurationAttribute>
        );
        
    }
}

ModelConfigurationPropertiesAttribute.propTypes = {
    properties:            PropTypes.object,
    onPropertyLinkTrigger: PropTypes.func
};
export default ModelConfigurationPropertiesAttribute;