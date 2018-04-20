import React from "react"
import ModelConfiguration, {ModelConfigurationTitle} from "../config";
import {SelectivelyActive} from "../../../../../../../components/index";
import ReactTooltip from "react-tooltip";
import {ActiveComponent, InactiveComponent} from "../../../../../../../components/selectivelyActive";

const ModelConfigurationWrapper = function ({model, type, description}) {
    let className = 'model--configuration';
    const title   = `Model Config à la ${type[0].toUpperCase() + type.substr(1)}`;
    return (
        <SelectivelyActive trigger={"click"}
                           className={`wrapper ${className}--wrapper`}
                           matchTarget={target => target.classList.contains('configuration--title')}
                           isActive={false}>
            <ActiveComponent>
                <ModelConfiguration title={title} config={model} description={description} />
            </ActiveComponent>
            
            <InactiveComponent>
                <div className={`${className}--title--wrapper`} data-tip data-for={`about_model-${type}`}>
                    <ReactTooltip id={`about_model-${type}`} class={"description--tooltip"} aria-haspopup={"true"} role="description" effect='solid'>
                        {description}
                    </ReactTooltip>
                    <ModelConfigurationTitle>{title}</ModelConfigurationTitle>
                </div>
            </InactiveComponent>
        </SelectivelyActive>
    );
};
export default ModelConfigurationWrapper;