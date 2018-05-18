import React from "react";
import * as PropTypes from "prop-types";
import {ConfigurationDescription, ConfigurationTitle} from "../../../../../../../components/configuration/configuration";
import {SelectivelyActive} from "../../../../../../../components/selectivelyActive";
import ReactTooltip from "react-tooltip";
import bind from "bind-decorator";
import {ActiveComponent, InactiveComponent} from "../../../../../../../components/selectivelyActive/components";
import {ModelAttribute} from "../attribute";

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
            <SelectivelyActive className={`wrapper model--configuration--wrapper`} matchTarget={ModelConfigurationWrapper.matchTarget}>
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
                <ConfigurationTitle>{this.title}</ConfigurationTitle>
                <ReactTooltip id={tooltipName} class="description--tooltip" aria-haspopup="true" role="tooltip" effect="solid">
                    <ConfigurationDescription>{this.props.description}</ConfigurationDescription>
                </ReactTooltip>
            </div>
        );
    }
    
    @bind
    ActiveComponent(props) {
        const {model: config}                         = this.props;
        const {smID, name, properties, ...attributes} = config;
        return (
            <div className="model--configuration">
                <ConfigurationTitle ownerType={'model'}>{this.title}</ConfigurationTitle>
                <ConfigurationDescription ownerType={'model'}>{this.props.description}</ConfigurationDescription>
                {
                    Object.entries({smID, name, ...attributes, properties})
                          .map(([attr, value]) => {
                              if ((!value && typeof value === 'object') || typeof value === 'undefined' || value === '') return null;
                              return <ModelAttribute key={attr}
                                                     activeProperties={this.props.activeProperties}
                                                     onTogglePropertyClick={this.props.onTogglePropertyClick}
                                                     name={attr}
                                                     value={value} />;
                          })
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