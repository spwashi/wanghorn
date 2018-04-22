import React from "react"
import * as PropTypes from "prop-types"
import {ModelConfigurationAttributeValue} from "./attr/value";
import {ModelConfigurationAttributeTitle} from "./attr/title";

const ModelConfigurationAttribute = ({value, attribute, valueMeta, children}) =>
    <div className={`attribute configuration--attribute model--configuration--attribute ${attribute} attribute__${attribute}`}>
        <ModelConfigurationAttributeTitle attribute={attribute} />
        <ModelConfigurationAttributeValue attribute={attribute} value={value}>
            <div className="configuration--value--meta model--configuration--value--meta">
                {valueMeta}
            </div>
            {children}
        </ModelConfigurationAttributeValue>
    </div>;

export default ModelConfigurationAttribute;

ModelConfigurationAttribute.propTypes = {
    attribute: PropTypes.string,
    meta:      PropTypes.element
};
