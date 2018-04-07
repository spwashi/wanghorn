import React from "react"
import * as PropTypes from "prop-types"

class ProfileImageContainer extends React.Component {
    render() {
        let profileImage   = this.props.children;
        const ProfileImage = props =>
            <div className="profile--image--wrapper">{profileImage}</div>;
        
        return (
            <div className="image--container profile--image--container">
                <ProfileImage />
            </div>
        )
    }
}

export {ProfileImageContainer};
ProfileImageContainer.propTypes = {
    children: PropTypes.element
};