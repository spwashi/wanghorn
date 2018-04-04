import React from "react"
import ModelConfiguration, {ModelConfigurationTitle} from "../config";
import {SelectivelyActive} from "../../../../../../../components/index";

const ModelConfigurationWrapper = function ({model, type = 'model'}) {
    let className = 'model--configuration';
    const title   = `[${type[0].toUpperCase() + type.substr(1)} as JSON]`;
    
    return <SelectivelyActive trigger={"click"}
                              className={`wrapper ${className}--wrapper`}
                              matchTarget={target => target.classList.contains('configuration--title')}
                              inactiveComponent={
                                  props =>
                                      <div className={`${className}--title`}>
                                          <ModelConfigurationTitle>{title}</ModelConfigurationTitle>
                                      </div>
                              }
                              activeComponent={
                                  props =>
                                      <ModelConfiguration title={title} config={model} />
                              }
                              isActive={false} />;
};
export default ModelConfigurationWrapper;