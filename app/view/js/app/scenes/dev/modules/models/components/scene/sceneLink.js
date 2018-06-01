import React from "react"
import * as PropTypes from "prop-types"
import {getURI} from "../../../../../../../path/resolution";
import {LinkItem} from "../../../../../../../components/navigation";

export const ModelSceneLink = function ({title = 'Model'}) {
    return <LinkItem to={getURI('dev--models')} wrapper={props => <span {...props} />}>{title}</LinkItem>;
};
ModelSceneLink.propTypes    = {
    title: PropTypes.string
};