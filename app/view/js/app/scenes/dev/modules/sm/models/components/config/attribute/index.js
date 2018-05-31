import React from "react"
import ModelConfigurationInheritsAttribute from "./inherits";
import SmEntityConfigurationPropertiesAttribute from "../../../../../../../sm/components/meta/attributes/properties/index";
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import ModelConfigurationPropertyMetaAttribute from "./propertyMeta";

export const ModelAttribute = ({name, value, activeProperties}) => {
    switch (name) {
        case 'inherits':
            return <ModelConfigurationInheritsAttribute inherits={value} />;
        case 'propertyMeta':
            return <ModelConfigurationPropertyMetaAttribute propertyMeta={value} />;
        case 'properties':
            return <SmEntityConfigurationPropertiesAttribute activeProperties={activeProperties}
                                                             ownerType={'model'}
                                                             properties={value} />;
        default:
            return <ConfigurationAttribute ownerType={'model'} attribute={name} value={value} />;
    }
};