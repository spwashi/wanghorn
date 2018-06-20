import React          from "react"
import * as PropTypes from "prop-types"
import ReactModal     from "react-modal";
import {LinkItem}     from "../../../components/navigation";

export function navigateBackOnHistory(history, uri) {
	history.action === 'PUSH' ? history.goBack() : history.push(uri);
}

export default class Modal extends React.Component {
	static propTypes = {
		onRequestClose:          PropTypes.func,
		onRequestEdit:           PropTypes.func,
		isOpen:                  PropTypes.bool,
		canEdit:                 PropTypes.bool,
		editUri:                 PropTypes.string,
		contentLabel:            PropTypes.string,
		title:                   PropTypes.string,
		onModalButtonCloseClick: PropTypes.func,

		baseClassName: PropTypes.string
	};

	componentDidMount() {
		ReactModal.setAppElement('#app--wrapper');
	}

	render() {
		let {title, onRequestClose, onRequestEdit, isOpen, contentLabel} = this.props;
		let {canEdit, editUri}                                           = this.props;

		let modalStatusClassNames  = {afterOpen: 'modal__-open', beforeClose: 'modal__-closing'};
		let baseClassname          = this.props.baseClassName || '';
		let overlayClassname       = this.props.baseClassName ? baseClassname + '--overlay' : '';
		let modalClassNames        = {base: `${baseClassname} modal--base`, ...modalStatusClassNames};
		let modalOverlayClassNames = {base: `${overlayClassname} modal--overlay`, ...modalStatusClassNames};

		let editButton = null;
		if (canEdit || editUri) {
			const editButtonClassName = 'button__edit modal--button__edit';
			if (editUri) {
				editButton = <LinkItem to={editUri} maintainHash={true} className={editButtonClassName}>E</LinkItem>;
			} else {
				editButton = <button tabIndex={0} className={editButtonClassName} onClick={onRequestEdit}>E</button>;
			}
		}
		return (
			<ReactModal onRequestClose={onRequestClose}
			            isOpen={isOpen}
			            shouldFocusAfterRender={true}
			            contentLabel={contentLabel || title}
			            overlayClassName={modalOverlayClassNames}
			            className={modalClassNames}>
				<header>
					<h2>{title}</h2>
					<div className="button--container">
						<button tabIndex={0} className={'button__close modal--button__close'} onClick={onRequestClose}>X</button>
						{editButton}
					</div>
				</header>
				{this.props.children}
			</ReactModal>
		)
	}
}