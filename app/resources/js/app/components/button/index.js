import PropTypes from 'prop-types';
import React, {Component} from "react";

const buttonStyle = {
    margin: '10px 10px 10px 0'
};

export default class Button extends React.Component {
    handleClick() {
        if (this.props.handleClick)
            return this.props.handleClick(...arguments);
    }
    
    render() {
        return (
            <button
                className={this.props.className}
                type={this.props.type ? this.props.type : 'button'}
                onClick={this.handleClick.bind(this)}>{this.props.label}</button>
        );
    }
}

Button.propTypes = {
    className:   PropTypes.string,
    handleClick: PropTypes.func,
    type:        PropTypes.string,
    label:       PropTypes.string.isRequired
};