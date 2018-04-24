import React from 'react'
import * as PropTypes from 'prop-types'

const ContentSection = ({name, children, className}) => {
    className = 'content--section ' + (className || '');
    return (
        <section className={className} id={name ? name : null}>
            {name ? <a name={name}/> : ''}
            {children}
        </section>
    )
};

export default ContentSection;
ContentSection.propTypes = {
    name: PropTypes.string
};