import React from "react"
import * as PropTypes from "prop-types"
import PropertyConfiguration, {PropertyConfigurationTitle} from "./index";
import SelectivelyActive from "../../../../../../components/selectivelyActive";

const PropertyConfigurationWrapper     = ({name, config}) =>
    <SelectivelyActive key={name}
                       className={"property--configuration--wrapper"}
                       trigger={"click"}
                       isActive={false}
                       matchTarget={target => target.classList.contains('configuration--title')}
                       inactiveComponent={
                           props =>
                               <div className={"property--configuration inactive"}>
                                   <PropertyConfigurationTitle>{name}</PropertyConfigurationTitle>
                               </div>
                       }
                       activeComponent={
                           props => <PropertyConfiguration className={"active"}
                                                           name={name}
                                                           config={{name, ...config}} />
                       } />;
PropertyConfigurationWrapper.propTypes = {
    name:   PropTypes.string,
    config: PropTypes.object
};
export default PropertyConfigurationWrapper;
