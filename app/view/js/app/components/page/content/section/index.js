import React from 'react'
import * as PropTypes from 'prop-types'

class ContentSection extends React.Component {
    render() {
        let {name, children, className, sectionRef} = this.props;
        className                                   = 'content--section ' + (className || '');
        return (
            <section ref={sectionRef} className={className} id={name ? name : null}>
                {name ? <a name={name} /> : ''}
                {children}
            </section>
        )
    };
}

export default ContentSection;
ContentSection.propTypes = {
    name: PropTypes.string
};