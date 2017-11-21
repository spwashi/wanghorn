import PropTypes from "prop-types"
import React from "react"

export const Container = ({type, items}) => {
    let classname = [
        type + '--container'
    ];
    
    return (
        <div className={classname.join()}>
            {items}
        </div>
    )
};



Container.propTypes = {
    type:  PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.element)
};