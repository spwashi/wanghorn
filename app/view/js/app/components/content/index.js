import React from "react";
import {connect} from "react-redux";

const Content =
          ({children}) => {
              return <div className="main main--content">{children}</div>;
          };

export default Content