import React from "react";
import {connect} from "react-redux";

const Content =
          ({children}) => {
              return <main className="main main--content">{children}</main>;
          };

export default Content