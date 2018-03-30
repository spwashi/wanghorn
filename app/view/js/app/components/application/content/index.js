import React from "react";
import PropTypes from "prop-types";

export const Content =
                 ({routes}) => {
                     return <div className="main main--content">{routes}</div>;
                 };
Content.propTypes    = {
    routes: PropTypes.object
};