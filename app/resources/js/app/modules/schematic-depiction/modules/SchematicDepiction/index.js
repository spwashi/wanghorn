import React from "react"
import {connect} from "react-redux";
import * as schematicDepictionConstants from '../../constants'
import * as schematicDepictionActions from "../../actions/index";
import {SchematicDepiction} from "./SchematicDepiction"

const connectDispatch = dispatch => {
    return {
        onCreateConceptClick: () => dispatch(schematicDepictionActions.initAnchor())
    };
};
const connectState    = state => {
    return state[schematicDepictionConstants.NAME];
};

export default connect(connectState, connectDispatch)(SchematicDepiction);