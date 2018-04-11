import React from "react"
import ModelConfigurationAttribute from "../index";
import PropertiesAttrMetaList from "./metaList";
import PropertyConfigurationWrapper from "../../../property/config/wrapper";

const MetaList            = props => <PropertiesAttrMetaList properties={props.properties} />;
const PropertiesContainer =
          props => {
              const objectEntryToPropertyConfig =
                        ([name, config]) =>
                            <PropertyConfigurationWrapper key={name} name={name} config={config} />;
              return (
                  <div className="model--configuration--attribute--container attribute__properties--container">
                      {Object.entries(props.properties).map(objectEntryToPropertyConfig)}
                  </div>
              );
          };

const ModelConfigurationPropertiesAttribute =
          ({properties}) =>
              <ModelConfigurationAttribute valueMeta={<MetaList properties={properties} />} attribute="properties">
                  <PropertiesContainer properties={properties} />
              </ModelConfigurationAttribute>;
export default ModelConfigurationPropertiesAttribute;