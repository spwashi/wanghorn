import React from "react";
import {connect} from "react-redux";
import ModelModule from "./modules/models";
import reducer from "./reducer"
import {selectDev} from "./selector";

const Dev = ({models}) => {
    return (
        <div className={'dev'}>
            <ModelModule />
        </div>
    );
};

export default connect(
    state => {
        let {models} = selectDev(state);
        return {models};
    }
)(Dev);
export {reducer}