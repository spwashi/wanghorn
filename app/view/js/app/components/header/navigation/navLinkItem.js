import React from "react"
import * as PropTypes from "prop-types"
import {getTitle, getURI} from "../../../../path/resolution";
import {LinkItem} from "base-components";
import {ListLinkWrapper as NavLinkWrapper} from "base-components/navigation/components/linkItem";
import bind from "bind-decorator";

export class NavLinkItem extends React.Component {
    state = {hasActiveDescendants: false};
    
    @bind
    onActiveDescendant(item) {
        if (this.state.hasActiveDescendants) return;
        this.setState({hasActiveDescendants: true});
    };
    
    @bind
    onFocusedDescendant(item) {
        if (this.state.focusedDescendant === item) return;
        this.setState({focusedDescendant: item});
    };
    
    @bind
    onBlurredDescendant(item) {
        if (this.state.focusedDescendant !== item) return;
        this.setState({focusedDescendant: null});
    };
    
    renderDescendants(children) {
        if (!children) {return null;}
        
        const renderedChildren = children.map((child, i) => <NavLinkItem key={child.name || i}
                                                                         whenFocused={() => this.onFocusedDescendant(this.props.item)}
                                                                         whenBlurred={() => this.onBlurredDescendant(this.props.item)}
                                                                         onIsActive={this.onActiveDescendant}
                                                                         item={child} />);
        return <ul>{renderedChildren}</ul>;
    };
    
    render() {
        const {name, exact, children} = this.props.item;
        const title                   = getTitle(name);
        const descendants             = this.renderDescendants(children);
        
        const descendantClassname = `${this.state.hasActiveDescendants ? 'has-active-descendants'
                                                                       : ''} ${this.state.focusedDescendant ? 'has-focused-descendants'
                                                                                                            : ''}`;
        
        const uri        = getURI(name, null, {root: ''});
        const onIsActive = () => {
            let onIsActive = this.props.onIsActive || function () {};
            return onIsActive(this.props.item);
        };
        
        return (
            <LinkItem to={uri}
                      exact={!!exact}
                      whenFocused={this.props.whenFocused}
                      whenBlurred={this.props.whenBlurred}
                      wrapper={NavLinkWrapper}
                      className={`${descendantClassname}`}
                      onIsActive={onIsActive}
                      descendants={descendants}>
                {title}
            </LinkItem>
        );
    };
}

NavLinkItem.propTypes = {
    onIsActive:  PropTypes.func,
    whenBlurred: PropTypes.func,
    whenFocused: PropTypes.func,
    item:        PropTypes.shape({
                                     exact:    PropTypes.bool,
                                     name:     PropTypes.string,
                                     children: PropTypes.arrayOf(PropTypes.object)
                                 }),
};