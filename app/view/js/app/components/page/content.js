import PropTypes from "prop-types";
import React, {Component} from 'react';

export class PageContent extends Component {
    componentDidMount() {
        document.title = this.props.pageTitle;
    }
    
    render() {
        const {pageClass, children} = {pageClass: this.props.pageClass, children: this.props.children};
        return (
            <div className={"page " + pageClass.replace('.', '')}>
                {children}
            </div>
        )
        
    }
}

PageContent.propTypes = {
    pageClass: PropTypes.string,
    pageTitle: PropTypes.string.isRequired
}
;