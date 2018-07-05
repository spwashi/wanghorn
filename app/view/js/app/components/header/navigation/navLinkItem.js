import React                               from "react"
import * as PropTypes                      from "prop-types"
import {getTitle, getURI}                  from "../../../../path/resolution";
import {LinkItem}                          from "base-components";
import {ListLinkWrapper as NavLinkWrapper} from "base-components/navigation/components/linkItem";
import bind                                from "bind-decorator";

export class NavLinkItem extends React.Component {
	state = {
		hasActiveDescendants: false,
		isDropdownActive:     false
	};

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
		this.setState({focusedDescendant: null}, () => {
			setTimeout(() => this.setState({isDropdownActive: !!this.state.focusedDescendant}), 10);
		});
	};

	renderDescendants(children) {
		if (!children) {return null;}

		const renderedChildren = children.map((child, i) => <NavLinkItem key={child.name || i}
		                                                                 whenFocused={() => this.onFocusedDescendant(this.props.item)}
		                                                                 whenBlurred={() => this.onBlurredDescendant(this.props.item)}
		                                                                 isTabAccessible={this.state.isDropdownActive}
		                                                                 onIsActive={this.onActiveDescendant}
		                                                                 item={child}/>);
		return <ul>{renderedChildren}</ul>;
	};

	render() {
		const {name, exact, children: descendants} = this.props.item;
		const title                                = getTitle(name);
		!title && console.log(name);
		const renderedDescendants        = this.renderDescendants(descendants);
		const activeDescendantClassname  = this.state.hasActiveDescendants ? 'has-active-descendants' : '';
		const focusedDescendantClassname = this.state.focusedDescendant ? 'has-focused-descendants' : '';
		const hasDescendantClassname     = descendants ? 'has-descendants' : '';
		const descendantClassname        = `${activeDescendantClassname} ${hasDescendantClassname} ${focusedDescendantClassname}`;
		const uri                        = getURI(name, null, {ROOT: ''});
		const onIsActive                 = () => {
			let onIsActive = this.props.onIsActive || function () {};
			return onIsActive(this.props.item);
		};
		const onSpaceBar                 = event => {
			event.preventDefault();
			if (!this.state.focusedDescendant) {
				this.setState({isDropdownActive: !this.state.isDropdownActive});
			}
		};
		const isDropdownActiveClassname  = this.state.isDropdownActive ? 'dropdown-active' : '';
		const whenBlurred                = () => {
			this.props.whenBlurred && this.props.whenBlurred();
			if (descendants) {
				setTimeout(() => {
					this.setState({isDropdownActive: this.state.hasActiveDescendants || !!this.state.focusedDescendant});
				}, 10)
			}
		};
		const isTabAccessible            = this.props.isTabAccessible;
		return (
			<LinkItem to={uri}
			          exact={!!exact}
			          isTabAccessible={isTabAccessible}
			          whenFocused={this.props.whenFocused}
			          whenBlurred={whenBlurred}
			          wrapper={NavLinkWrapper}
			          onSpaceBar={onSpaceBar}
			          className={`${descendantClassname} ${isDropdownActiveClassname}`}
			          onIsActive={onIsActive}
			          descendants={renderedDescendants}>
				{title}
				{descendants ? <i className="fas fa-chevron-down"/> : null}
			</LinkItem>
		);
	};
}

NavLinkItem.propTypes = {
	onIsActive:      PropTypes.func,
	whenBlurred:     PropTypes.func,
	whenFocused:     PropTypes.func,
	isTabAccessible: PropTypes.bool,
	item:            PropTypes.shape({
		                                 exact:    PropTypes.bool,
		                                 name:     PropTypes.string,
		                                 children: PropTypes.arrayOf(PropTypes.object)
	                                 }),
};