import React from "react"
import * as PropTypes from "prop-types"
import ModelConfigurationAttribute from "../attribute";
import ModelConfigurationPropertiesAttribute from "../attribute/properties";

export const ModelConfigurationTitle =
                 ({children}) =>
                     <div className={"configuration--title model--configuration--title"}>
                         {children}
                     </div>;

class ModelConfiguration extends React.Component {
    render() {
        const config                             = this.props.config;
        const title                              = this.props.title;
        const {smID, name, properties, ...attrs} = config;
        const objectEntryToAttr                  =
                  ([attr, value]) => {
                      console.log(value);
                      switch (attr) {
                          case 'properties':
                              return <ModelConfigurationPropertiesAttribute key={attr} properties={value} />;
                          default:
                              return <ModelConfigurationAttribute key={attr} attribute={attr} value={value} />;
                      }
                  };
        return (
            <div className="model--configuration">
                <ModelConfigurationTitle>{title}</ModelConfigurationTitle>
                {Object.entries({smID, name, ...attrs, properties}).map(objectEntryToAttr)}
            </div
            >
        );
    }
}

ModelConfiguration.propTypes = {
    config: PropTypes.object,
    title:  PropTypes.string
};
export default ModelConfiguration;