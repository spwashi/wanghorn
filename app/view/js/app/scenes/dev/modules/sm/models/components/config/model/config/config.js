import React from "react"

export const ModelConfigurationTitle       = ({children}) =>
    <div className="title configuration--title model--configuration--title">
        {children}
    </div>;
export const ModelConfigurationDescription = ({children: description}) =>
    <div className="description configuration--description model--configuration--description">
        {description}
    </div>;