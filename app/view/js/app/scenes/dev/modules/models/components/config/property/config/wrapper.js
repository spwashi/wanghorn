import React from "react"
import * as PropTypes from "prop-types"
import PropertyConfiguration, {PropertyConfigurationTitle} from "./config";
import SelectivelyActive, {ActiveComponent, InactiveComponent} from "../../../../../../components/selectivelyActive";

const PropertyConfigurationWrapper     =
          ({name, config}) =>
              <SelectivelyActive key={name}
                                 className={"property--configuration--wrapper"}
                                 isActive={true}
                                 matchTarget={target => target.classList.contains('configuration--title')}>
                  <InactiveComponent>
                      <div className={"property--configuration inactive"}>
                          <PropertyConfigurationTitle>{name}</PropertyConfigurationTitle>
                      </div>
                  </InactiveComponent>
                  <ActiveComponent>
                      <PropertyConfiguration className={"active"} name={name} config={{name, ...config}} />
                  </ActiveComponent>
              </SelectivelyActive>;
PropertyConfigurationWrapper.propTypes = {
    name:   PropTypes.string,
    config: PropTypes.object
};
export default PropertyConfigurationWrapper;
