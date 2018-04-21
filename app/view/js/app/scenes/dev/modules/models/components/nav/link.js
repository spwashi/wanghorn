import React from "react"
import * as PropTypes from "prop-types"

export const ModelLink =
                 ({smID, isActive, onClick}) => {
                     return <a onClick={onClick} data-sm_id={smID} href={`#${smID}`}>{smID}</a>;
                 };
ModelLink.propTypes    = {
    smID:     PropTypes.string,
    isActive: PropTypes.bool,
    onClick:  PropTypes.func
};