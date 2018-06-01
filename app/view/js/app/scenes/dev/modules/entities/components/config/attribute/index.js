import React from "react"
import SmEntityConfigurationPropertiesAttribute from "../../../../../../sm/components/meta/attributes/properties/index";
import {ConfigurationAttribute} from "../../../../../../sm/components/configuration/index";

export const EntityAttribute = ({name: attribute, value}) => {
    switch (attribute) {
        case 'contexts':
            if (!value) return null;
            return (
                <ConfigurationAttribute attribute={attribute} ownerType={'entity'}>
                    {
                        Object.entries(value)
                              .map(entry => {
                                  const [context_name, context_values] = entry;
                                  return (
                                      <div key={context_name} className={`context context__${context_name}`}>
                                          {JSON.stringify(context_values)}
                                      </div>
                                  )
                              })
                    }
                </ConfigurationAttribute>
            );
        case 'properties':
            return <SmEntityConfigurationPropertiesAttribute ownerType={'entity'} properties={value} />;
        default:
            return <ConfigurationAttribute ownerType={'entity'} attribute={attribute} value={value} />;
    }
};