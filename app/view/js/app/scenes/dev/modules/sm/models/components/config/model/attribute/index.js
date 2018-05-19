import React from "react"
import ModelConfigurationInheritsAttribute from "./inherits";
import SmEntityConfigurationPropertiesAttribute from "../../../../../components/propertyOwner/attribute/properties";
import {ConfigurationAttribute} from "../../../../../../../components/configuration";
import ModelConfigurationPropertyMetaAttribute from "./propertyMeta";

export const ModelAttribute = ({name, value, activeProperties, onTogglePropertyClick}) => {
    console.log(name, value);
    
    switch (name) {
        case 'inherits':
            return <ModelConfigurationInheritsAttribute inherits={value} />;
        case 'propertyMeta':
            return <ModelConfigurationPropertyMetaAttribute propertyMeta={value}
                                                            onPropertyLinkTrigger={onTogglePropertyClick} />;
        case 'properties':
            return <SmEntityConfigurationPropertiesAttribute activeProperties={activeProperties} onPropertyLinkTrigger={onTogglePropertyClick} properties={value} />;
        default:
            return <ConfigurationAttribute ownerType={'model'} attribute={name} value={value} />;
    }
};