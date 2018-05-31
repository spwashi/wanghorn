import React from "react"
import * as PropTypes from "prop-types"
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import {PropertySmIDLink} from "../../../../../../../sm/components/meta/attributes/properties/smID_Link";

const NamedIndexList = ({indexList: index}) => {
    return (
        <ul>
            {(index || []).map((smID, k) => <li key={k}><PropertySmIDLink smID={smID} /></li>)}
        </ul>
    );
};
const UniqueIndex    = function ({uniqueIndex}) {
    let ArrayIndex  = function () {
        return <NamedIndexList indexList={uniqueIndex} />;
    };
    let ObjectIndex = function () {
        return Object.entries(uniqueIndex)
                     .map(([name, index]) => {
                         return (
                             <div className="unique_index" key={name}>
                                 <div className="index--title title">{name}</div>
                                 <div className="index--value value">
                                     <NamedIndexList indexList={index} />
                                 </div>
                             </div>
                         )
                     });
    };
    return <div className="propertyMeta--index unique">
        <div className="title">Unique Keys</div>
        <div className="value">
            {
                Array.isArray(uniqueIndex) ? <ArrayIndex />
                                           : <ObjectIndex />
            }
        </div>
    </div>;
};
const PrimaryIndex   = function ({primaryIndex}) {
    return <div className="propertyMeta--index primary">
        <div className="title">Primary Key</div>
        <div className="value">
            <NamedIndexList indexList={primaryIndex} />
        </div>
    </div>;
};

const ModelConfigurationPropertyMetaAttribute     =
          ({propertyMeta}) => {
              if (!propertyMeta) return null;
              let primaryIndex   = propertyMeta.primary;
              let uniqueIndex    = propertyMeta.unique;
              let hasUniqueIndex = Array.isArray(uniqueIndex) ? uniqueIndex.length
                                                              : Object.entries(uniqueIndex || {}).length;
              return (
                  <ConfigurationAttribute ownerType={'model'} attribute="propertyMeta">
                      {primaryIndex ? <PrimaryIndex {...{primaryIndex}} /> : null}
                      {hasUniqueIndex ? <UniqueIndex {...{uniqueIndex}} /> : null}
                  </ConfigurationAttribute>
              );
          };
ModelConfigurationPropertyMetaAttribute.propTypes = {
    propertyMeta: PropTypes.object
};
export default ModelConfigurationPropertyMetaAttribute;