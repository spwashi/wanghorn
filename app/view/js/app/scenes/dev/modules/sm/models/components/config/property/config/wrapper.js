import React from "react"
import * as PropTypes from "prop-types"
import PropertyConfiguration, {PropertyConfigurationTitle} from "./config";
import {SelectivelyActive} from "../../../../../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../../../../../components/selectivelyActive/components";

let InactivePropertyConfigComponent    = ({name}) =>
    <div className={"property--configuration inactive"}>
        <PropertyConfigurationTitle>{name}</PropertyConfigurationTitle>
    </div>;
const PropertyConfigurationWrapper     =
        ({name, config}) =>
            <SelectivelyActive key={name}
                               className={"property--configuration--wrapper"}
                               isActive={true}
                               matchTarget={target => target.classList.contains('configuration--title')}>
                <InactiveComponent component={InactivePropertyConfigComponent} name={name} />
                <ActiveComponent component={PropertyConfiguration} className={"active"} name={name} config={{name, ...config}} />
            </SelectivelyActive>;
PropertyConfigurationWrapper.propTypes = {
    name:   PropTypes.string,
    config: PropTypes.object
};
export default PropertyConfigurationWrapper;
