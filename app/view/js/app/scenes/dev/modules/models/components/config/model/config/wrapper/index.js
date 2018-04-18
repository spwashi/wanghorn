import React from "react"
import ModelConfiguration, {ModelConfigurationTitle} from "../config";
import {SelectivelyActive} from "../../../../../../../components/index";
import ReactTooltip from "react-tooltip";

const ModelConfigurationWrapper = function ({model, type, description}) {
    let className = 'model--configuration';
    const title   = `${type[0].toUpperCase() + type.substr(1)} as JSON`;
    const smID    = model.smID;
    
    return <SelectivelyActive trigger={"click"}
                              className={`wrapper ${className}--wrapper`}
                              matchTarget={target => target.classList.contains('configuration--title')}
                              inactiveComponent={
                                  props =>
                                      <div className={`${className}--title--wrapper`} data-tip data-for={`about_model-${type}`}>
                                          <ReactTooltip id={`about_model-${type}`} class={"description--tooltip"} aria-haspopup={"true"} role="description" effect='solid'>
                                              {description}
                                          </ReactTooltip>
                                          <ModelConfigurationTitle>{title}</ModelConfigurationTitle>
                                      </div>
                              }
                              activeComponent={
                                  props =>
                                      <ModelConfiguration title={title} config={model} description={description} />
                              }
                              isActive={false} />;
};
export default ModelConfigurationWrapper;