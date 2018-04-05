import React from "react"
import {withRouter} from "react-router";
import * as PropTypes from "prop-types"
import {Link} from "./link";

class LinkItem extends React.Component {
    render() {
        let {exact, activeClassName, to, as, className} = this.props;
        let {match, location, history}                  = this.props;
        
        const isActive = location.pathname.replace(/\/$/, "") === to.replace(/\/$/, "");
    
        const activeClassname = isActive ? 'active active--link' : '';
        className             = className || '';
        className             = `link_item navigation--link_item ${className} ${activeClassname}`;
        return (
            <li className={className}>
                <Link exact={exact} to={to} activeClassName={activeClassName}>
                    {as}
                </Link>
            </li>);
    }
}

LinkItem           = withRouter(LinkItem);
LinkItem.propTypes = {
    exact:           PropTypes.bool,
    activeClassName: PropTypes.string,
    to:              PropTypes.string,
    as:              PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className:       PropTypes.string
};
export {LinkItem};
