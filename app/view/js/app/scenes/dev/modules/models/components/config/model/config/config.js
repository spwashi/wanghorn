import React from "react"
import * as PropTypes from "prop-types"
import ModelConfigurationAttribute from "../attribute";
import ModelConfigurationPropertiesAttribute from "../attribute/properties";
import ModelConfigurationInheritsAttribute from "../attribute/inherits";

export const ModelConfigurationTitle       =
                 ({children}) =>
                     <div className={"title configuration--title model--configuration--title"}>
                         {children}
                     </div>;
export const ModelConfigurationDescription =
                 ({children: description}) =>
                     <div className="description configuration--description model--configuration--description">
                         {description}
                     </div>;

class ModelConfiguration extends React.Component {
    ModelAttribute({name, value}) {
        switch (name) {
            case 'inherits':
                return <ModelConfigurationInheritsAttribute inherits={value} />;
            case 'properties':
                return <ModelConfigurationPropertiesAttribute activeProperties={this.props.activeProperties}
                                                              onPropertyLinkTrigger={this.props.onTogglePropertyClick}
                                                              properties={value} />;
            default:
                return <ModelConfigurationAttribute attribute={name} value={value} />;
        }
    };
    
    render() {
        const {config, description, title}       = this.props;
        const {smID, name, properties, ...attrs} = config;
        const ModelAttribute                     = this.ModelAttribute.bind(this);
        return (
            <div className="model--configuration">
                <ModelConfigurationTitle>{title}</ModelConfigurationTitle>
                <ModelConfigurationDescription>{description}</ModelConfigurationDescription>
                {
                    Object.entries({smID, name, ...attrs, properties})
                          .map(([attr, value]) => <ModelAttribute key={attr} name={attr} value={value} />)
                }
            </div>
        );
    }
}

ModelConfiguration.propTypes = {
    config:                PropTypes.object,
    title:                 PropTypes.string,
    onTogglePropertyClick: PropTypes.func,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    description:           PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
export default ModelConfiguration;