import React from "react"
import * as PropTypes from "prop-types"
import {Factory} from "../../../../../../../../modules/factory/index";
import {SmEntityTitle} from "./title";

export class SmEntitySelectOption extends React.Component {
    static displayFactory = new Factory([props => SmEntityTitle]);
    static propTypes      = {
        children:   PropTypes.node,
        className:  PropTypes.string,
        isDisabled: PropTypes.bool,
        isFocused:  PropTypes.bool,
        isSelected: PropTypes.bool,
        onFocus:    PropTypes.func,
        onSelect:   PropTypes.func,
        option:     PropTypes.object,
    };
    
    handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.props.onSelect) this.props.onSelect(this.props.option, event);
    }
    
    handleMouseEnter(event) {
        if (this.props.onFocus) this.props.onFocus(this.props.option, event);
    }
    
    handleMouseMove(event) {
        if (this.props.isFocused || !this.props.onFocus) return;
        this.props.onFocus(this.props.option, event);
    }
    
    render() {
        const optionValue = this.getOptionValueObj();
        if (!optionValue) return null;
        const {label: title} = optionValue;
        const onMouseMove    = this.handleMouseMove.bind(this);
        const onMouseEnter   = this.handleMouseEnter.bind(this);
        const onMouseDown    = this.handleMouseDown.bind(this);
        const className      = this.props.className;
        const Component      = SmEntitySelectOption.displayFactory.Component;
        return (
            <span  {...{className, onMouseDown, onMouseEnter, onMouseMove}} title={title}>
                <Component title={title} {...optionValue} />
            </span>
        );
    }
    
    getOptionValueObj() {
        const props       = this.props;
        const optionValue = props.value || props.option;
        return optionValue;
    }
}