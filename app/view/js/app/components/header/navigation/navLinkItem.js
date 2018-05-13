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
    
    renderDescendants(children) {
        if (!children) {return null;}
        
        const renderedChildren = children.map((child, i) => {
            return <NavLinkItem key={child.name || i} onIsActive={this.onActiveDescendant} item={child} />;
        });
        
        return <ul>{renderedChildren}</ul>;
    };
    
    render() {
        const {name, exact, children} = this.props.item;
        const title                   = getTitle(name);
        const descendants             = this.renderDescendants(children);
        const descendantClassname     = this.state.hasActiveDescendants ? 'has-active-descendants' : '';
        
        const uri        = getURI(name, null, {root: ''});
        const onIsActive = this.props.onIsActive || function () {};
        return (
            <LinkItem exact={!!exact} to={uri}
                      wrapper={NavLinkWrapper} className={`${descendantClassname}`}
                      onIsActive={() => onIsActive(this.props.item)} descendants={descendants}>
                {title}
            </LinkItem>
        );
    };
}

NavLinkItem.propTypes = {
    onIsActive: PropTypes.func,
    item:       PropTypes.shape({
                                    exact:    PropTypes.bool,
                                    name:     PropTypes.string,
                                    children: PropTypes.arrayOf(PropTypes.object)
                                }),
};