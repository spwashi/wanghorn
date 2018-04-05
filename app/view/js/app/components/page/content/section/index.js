import React from "react"
import * as PropTypes from "prop-types"

const ContentSection = ({name, children}) => {
    return (
        <section id={name}>
            <a name={name} />
            {children}
        </section>
    )
};

export default ContentSection;
ContentSection.propTypes = {
    name: PropTypes.string.isRequired
};