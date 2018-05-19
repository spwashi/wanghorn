import React from 'react'
import * as PropTypes from 'prop-types'

class ContentSection extends React.Component {
    render() {
        let {name, header, children, className, sectionRef} = this.props;
        className                                           = 'content--section ' + (className || '');
        return (
            <section ref={sectionRef} className={className} id={name ? name : null}>
                {name ? <a name={name} /> : ''}
                {header}
                <div className="content">{children}</div>
            </section>
        )
    };
}

export const ContentSectionHeader = ({title, className}) => <header className={'content--section--header ' + className}><h2>{title || children}</h2></header>;
export default ContentSection;
ContentSection.propTypes       = {
    name:       PropTypes.string,
    header:     PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    className:  PropTypes.string,
    sectionRef: PropTypes.func
};
ContentSectionHeader.propTypes = {
    title:     PropTypes.string,
    className: PropTypes.string
};