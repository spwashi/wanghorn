import PropTypes from "prop-types"
import React, {Component} from "react"
import {ContainerItemList} from "./ContainerItemList";


class Container extends Component {
	constructor(props) {super(props)}

	render() {
		const _ContainerHeader  = this.props.ContainerHeader || null;
		const containerItemType = this.props.containerItemType;
		const items             = this.props.items;
		let classname           = [containerItemType + '--container'];

		return (
			<div className={classname.join()}>
				<_ContainerHeader/>
				<ContainerItemList items={items}
				                   containerItemType={containerItemType}
				/>
			</div>
		)
	}

}


Container.propTypes = {
	ContainerHeader: PropTypes.element,

	containerItemType: PropTypes.string,
	items:             PropTypes.arrayOf(PropTypes.element)
};