import PropTypes from "prop-types"
import React from "react"

const ContainerItemList = ({containerItemType, items}) => {
	let classname = [containerItemType + '--container--items'];
	return <div className={classname.join()}/>
};

ContainerItemList.propTypes = {
	containerItemType: PropTypes.string,
	items:             PropTypes.arrayOf(PropTypes.element)
};

export {ContainerItemList};