import PropTypes from "prop-types";
import React, {Component} from 'react';
import {TweenLite} from "gsap";
import bind from 'bind-decorator';

const BackToTop = class extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {active: false};
    }
    
    toTop(event) {
        TweenLite.to(window, .5, {scrollTo: 0,})
    };
    
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    
    @bind
    handleScroll(event) {
        let scrollTop = document.documentElement.scrollTop;
        if (scrollTop > 100) {
            !this.state.active && this.setState({active: true});
        } else {
            this.state.active && this.setState({active: false});
        }
    }
    
    render() {
        const classname = this.state.active ? 'active' : 'inactive';
        console.log(classname);
        return <div id="back-to-top" className={classname} tabIndex={0} onClick={this.toTop}></div>;
    }
};

export class Content extends Component {
    componentDidMount() {
        document.title = this.props.pageTitle;
    }
    
    render() {
        const {pageClass, children} = {pageClass: this.props.pageClass, children: this.props.children};
        
        return (
            <div className={"page " + pageClass.replace('.', '')}>
                {children}
                <BackToTop />
            </div>
        )
    }
}

Content.propTypes = {
    pageClass: PropTypes.string,
    pageTitle: PropTypes.string.isRequired
};