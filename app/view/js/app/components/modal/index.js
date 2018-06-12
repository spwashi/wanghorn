import React          from "react"
import * as PropTypes from "prop-types"
import ReactModal     from "react-modal";

export function navigateBackOnHistory(history, uri) {
	history.action === 'PUSH' ? history.goBack() : history.push(uri);
}

export default class Modal extends React.Component {
	static propTypes = {
		onRequestClose:          PropTypes.func,
		isOpen:                  PropTypes.bool,
		contentLabel:            PropTypes.string,
		title:                   PropTypes.string,
		onModalButtonCloseClick: PropTypes.func,

		baseClassName: PropTypes.string
	};

	componentDidMount() {
		ReactModal.setAppElement('#app--wrapper');
	}

	render() {
		let {title, onRequestClose, isOpen, contentLabel} = this.props;
		let modalStatusClassNames                         = {
			afterOpen:   'modal__-open',
			beforeClose: 'modal__-closing'
		};
		let baseClassname                                 = this.props.baseClassName || '';
		let overlayClassname                              = this.props.baseClassName ? baseClassname + '--overlay' : '';
		let modalClassNames                               = {base: `${baseClassname} modal--base`, ...modalStatusClassNames};
		let modalOverlayClassNames                        = {base: `${overlayClassname} modal--overlay`, ...modalStatusClassNames};

		return (
			<ReactModal onRequestClose={onRequestClose}
			            isOpen={isOpen}
			            shouldFocusAfterRender={true}
			            contentLabel={contentLabel || title}
			            overlayClassName={modalOverlayClassNames}
			            className={modalClassNames}>
				<header>
					<h2>{title}</h2>
					<button tabIndex={0} className={'button__close modal--button__close'} onClick={onRequestClose}>X</button>
				</header>
				{this.props.children}
			</ReactModal>
		)
	}
}