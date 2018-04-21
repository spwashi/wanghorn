import React from "react";
import * as PropTypes from "prop-types";
import ModelConfiguration, {ModelConfigurationDescription, ModelConfigurationTitle} from "./config";
import {ActiveComponent, InactiveComponent, SelectivelyActive} from "../../../../../../components/selectivelyActive/index";
import ReactTooltip from "react-tooltip";
import bind from "bind-decorator";

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
                <ModelConfigurationTitle>{this.title}</ModelConfigurationTitle>
                <ReactTooltip id={tooltipName} class="description--tooltip" aria-haspopup="true" role="tooltip" effect="solid">
                    <ModelConfigurationDescription>{this.props.description}</ModelConfigurationDescription>
                </ReactTooltip>
            </div>
        );
    }
    
    @bind
    ActiveComponent(props) {
        return <ModelConfiguration title={this.title}
                                   activeProperties={this.props.activeProperties}
                                   config={this.props.model}
                                   onTogglePropertyClick={this.props.onTogglePropertyClick}
                                   description={this.props.description} />;
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