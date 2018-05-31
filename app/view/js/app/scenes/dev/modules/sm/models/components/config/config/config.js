import React from "react";
import * as PropTypes from "prop-types";
import {ConfigurationDescription, ConfigurationTitle} from "../../../../../../components/configuration/configuration";
import ReactTooltip from "react-tooltip";
import bind from "bind-decorator";
import {ActiveComponent, InactiveComponent} from "../../../../../../components/selectivelyActive/components/index";
import {ModelAttribute} from "../attribute";
import {LinkItem} from "../../../../../../../../../components/navigation/index";

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
        let ActiveComponent   = this.ActiveComponent;
        let InactiveComponent = this.InactiveComponent;
        return (
            <div className={`wrapper smEntity--configuration--wrapper`}>
                {this.props.isActive ? <ActiveComponent /> : <InactiveComponent />}
            </div>
        );
    };
    
    @bind
    InactiveComponent(props) {
        let tooltipName = `about_model-${this.props.type}`;
        return (
            <div className={`wrapper title--wrapper configuration--title--wrapper smEntity--configuration--title--wrapper`}
                 data-tip
                 data-for={tooltipName}>
                <LinkItem to={`#${this.props.type}`} isButton={true}>
                    <ConfigurationTitle ownerType={'model'}>{this.title}</ConfigurationTitle>
                </LinkItem>
                <ReactTooltip id={tooltipName} class="description--tooltip" aria-haspopup="true" role="tooltip" effect="solid">
                    <ConfigurationDescription>{this.props.description}</ConfigurationDescription>
                </ReactTooltip>
            </div>
        );
    }
    
    @bind
    ActiveComponent(props) {
        const {schematic}                             = this.props;
        const {smID, name, properties, ...attributes} = schematic;
        return (
            <div className="smEntity--configuration">
                <LinkItem to={`#`} isButton={true}>
                    <ConfigurationTitle ownerType={'model'}>{this.title}</ConfigurationTitle>
                </LinkItem>
                <ConfigurationDescription ownerType={'model'}>{this.props.description}</ConfigurationDescription>
                {
                    Object.entries({smID, name, ...attributes, properties})
                          .map(([attr, value]) => {
                              if ((!value && typeof value === 'object') || typeof value === 'undefined' || value === '') return null;
                        
                              return <ModelAttribute key={attr} name={attr} value={value}
                                                     activeProperties={this.props.activeProperties} />;
                          })
                }
            </div>
        );
    }
}

ModelConfigurationWrapper.propTypes = {
    isActive:              PropTypes.bool,
    type:                  PropTypes.string,
    onTogglePropertyClick: PropTypes.func,
    model:                 PropTypes.object,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    description:           PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
export default ModelConfigurationWrapper;