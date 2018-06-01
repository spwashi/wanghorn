import React from "react"
import * as PropTypes from "prop-types"
import {getURI} from "../../../../../../../path/resolution";
import {LinkItem} from "../../../../../../../components/navigation";

export const EntitySceneLink = function ({title = 'Entity'}) {
    return <LinkItem to={getURI('dev--entities')} wrapper={props => <span {...props} />}>{title}</LinkItem>;
};
EntitySceneLink.propTypes    = {
    title: PropTypes.string
};