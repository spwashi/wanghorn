import React from "react"
import ModelConfigurationInheritsAttribute from "./inherits";
import SmEntityConfigurationPropertiesAttribute from "../../../../components/propertyOwner/attribute/properties/index";
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import ModelConfigurationPropertyMetaAttribute from "./propertyMeta";

export const ModelAttribute = ({name, value, activeProperties, onTogglePropertyClick}) => {
    switch (name) {
        case 'inherits':
            return <ModelConfigurationInheritsAttribute inherits={value} />;
        case 'propertyMeta':
            return <ModelConfigurationPropertyMetaAttribute propertyMeta={value}
                                                            onPropertyLinkTrigger={onTogglePropertyClick} />;
        case 'properties':
            return <SmEntityConfigurationPropertiesAttribute activeProperties={activeProperties}
                                                             ownerType={'model'}
                                                             onPropertyLinkTrigger={onTogglePropertyClick}
                                                             properties={value} />;
        default:
            return <ConfigurationAttribute ownerType={'model'}
                                           attribute={name}
                                           value={value} />;
    }
};