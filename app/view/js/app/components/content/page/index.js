import React from 'react';

export const PageContent = ({pageTitle, pageClass, children}) => {
    return (
        <div className={"page " + pageClass}>
            <h1>{pageTitle}</h1>
            {children}
        </div>
    )
};