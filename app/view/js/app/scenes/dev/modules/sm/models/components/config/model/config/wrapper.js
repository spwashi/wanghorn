import React from "react";
import * as PropTypes from "prop-types";
import {ModelConfigurationDescription, ModelConfigurationTitle} from "./config";
import {SelectivelyActive} from "../../../../../../../components/selectivelyActive";
import ReactTooltip from "react-tooltip";
import bind from "bind-decorator";
import {ActiveComponent, InactiveComponent} from "../../../../../../../components/selectivelyActive/components";
import ModelConfigurationAttribute from "../attribute";
import ModelConfigurationPropertiesAttribute from "../attribute/properties";
import ModelConfigurationInheritsAttribute from "../attribute/inherits";

/**
 * Wraps the configuration of a Model to provide more specific display capabilities
 */
class ModelConfigurationWrapper extends React.Component {
    get title() {
        const {type} = this.props;
        return `Model Config à la ${type[0].toUpperCase() + type.substr(1)}`
    }
    
    static matchTarget = (target) => target.classList.contains('configuration--title');
    
    render() {
        return (
            <SelectivelyActive className={`wrapper model--configuration--wrapper`}
                               matchTarget={ModelConfigurationWrapper.matchTarget}>
                <ActiveComponent component={this.ActiveComponent} />
                <InactiveComponent component={this.InactiveComponent} />
            </SelectivelyActive>
        );
    };
    
    @bind
    InactiveComponent(props) {
        let tooltipName = `about_model-${this.props.type}`;
        return (
            <div className={`wrapper title--wrapper configuration--title--wrapper model--configuration--title--wrapper`} data-tip data-for={tooltipName}>
                <ModelConfigurationTitle>{this.title}</ModelConfigurationTitle>
                <ReactTooltip id={tooltipName} class="description--tooltip" aria-haspopup="true" role="tooltip" effect="solid">
                    <ModelConfigurationDescription>{this.props.description}</ModelConfigurationDescription>
                </ReactTooltip>
            </div>
        );
    }
    
    @bind
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
    
    @bind
    ActiveComponent(props) {
        const {model: config}                         = this.props;
        const {smID, name, properties, ...attributes} = config;
        const ModelAttribute                          = this.ModelAttribute;
        return (
            <div className="model--configuration">
                <ModelConfigurationTitle>{this.title}</ModelConfigurationTitle>
                <ModelConfigurationDescription>{this.props.description}</ModelConfigurationDescription>
                {
                    Object.entries({smID, name, ...attributes, properties})
                          .map(([attr, value]) => <ModelAttribute key={attr} name={attr} value={value} />)
                }
            </div>
        );
    }
}

ModelConfigurationWrapper.propTypes = {
    type:                  PropTypes.string,
    onTogglePropertyClick: PropTypes.func,
    model:                 PropTypes.object,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    description:           PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
export default ModelConfigurationWrapper;