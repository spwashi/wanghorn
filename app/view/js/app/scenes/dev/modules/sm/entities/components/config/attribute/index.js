import React from "react"
import EntityConfigurationInheritsAttribute from "./inherits";
import SmEntityConfigurationPropertiesAttribute from "../../../../../../../sm/smEntity/meta/attributes/properties/index";
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import EntityConfigurationPropertyMetaAttribute from "./propertyMeta";

export const EntityAttribute = ({name, value, activeProperties, onTogglePropertyClick}) => {
    switch (name) {
        case 'inherits':
            return <EntityConfigurationInheritsAttribute inherits={value} />;
        case 'propertyMeta':
            return <EntityConfigurationPropertyMetaAttribute propertyMeta={value}
                                                            onPropertyLinkTrigger={onTogglePropertyClick} />;
        case 'properties':
            return <SmEntityConfigurationPropertiesAttribute activeProperties={activeProperties}
                                                             ownerType={'entity'}
                                                             onPropertyLinkTrigger={onTogglePropertyClick}
                                                             properties={value} />;
        default:
            return <ConfigurationAttribute ownerType={'entity'}
                                           attribute={name}
                                           value={value} />;
    }
};