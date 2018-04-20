import React, {Component} from "react";
import * as PropTypes from "prop-types";
import Stateful from "../stateful/stateful";
import State from "../stateful/state";

class SelectivelyActive extends Component {
    _activeComponent;
    _inactiveComponent;
    
    _cancelClick = false;
    
    matchTarget() {
        return true;
    }
    
    constructor(props: { isActive: boolean | undefined, trigger: "click" }) {
        super(props);
        if (props.children) {
            const children = props.children;
            React.Children.forEach(children, (child) => {
                if (child.type === ActiveComponent) {this._activeComponent = () => child;}
                if (child.type === InactiveComponent) {this._inactiveComponent = () => child;}
            });
        } else {
            this._activeComponent   = props.activeComponent;
            this._inactiveComponent = props.inactiveComponent || (() => <div />);
        }
        this.matchTarget = props.matchTarget || this.matchTarget;
        this.state       = {
            isActive: props.isActive,
        }
    }
    
    handleMouseMove(e) {
        if (!this.props.trigger === "click") return;
        if (!this._mouseDown) return;
        const current  = {x: e.screenX, y: e.screenY};
        const distance =
                  Math.sqrt(
                      Math.pow(this._mouseDown.x - current.x, 2) + Math.pow(this._mouseDown.y - current.y, 2)
                  );
        if (distance > 25) {
            console.log(current, distance);
            this._cancelClick = true;
        }
    }
    
    handleMouseDown(e) {
        this._cancelClick = false;
        if (!this.props.trigger === "click") return;
        this._mouseDown = {x: e.screenX, y: e.screenY};
    }
    
    handleMouseUp(e) {
        if (!this.props.trigger === "click") return;
        this._mouseDown = null;
    }
    
    handleClick(event) {
        if (this.props.trigger !== "click") return;
        if (this._cancelClick) return;
        const target = event.target;
        
        if (this.matchTarget(target)) {
            this.setState({isActive: !this.state.isActive});
            event.stopPropagation();
        }
    }
    
    render() {
        let className           = `${(this.props.className || '')} ${(this.state.isActive ? 'active' : 'inactive')}`;
        const InactiveComponent = this._inactiveComponent;
        const ActiveComponent   = this._activeComponent;
        return (
            <div className={className + ' selectively-active'}
                 onClick={this.handleClick.bind(this)}
                 onMouseDown={this.handleMouseDown.bind(this)}
                 onMouseUp={this.handleMouseUp.bind(this)}
                 onMouseMove={this.handleMouseMove.bind(this)}>
                <Stateful activeState={this.state.isActive ? 'active' : 'inactive'}>
                    <State name={'active'}><ActiveComponent /></State>
                    <State name={'inactive'}><InactiveComponent /></State>
                </Stateful>
            </div>
        );
    }
}

export const ActiveComponent   = ({children}) => children || null;
export const InactiveComponent = ({children}) => children || null;
export default SelectivelyActive;

SelectivelyActive.propTypes = {
    trigger:           PropTypes.oneOf(["click"]),
    className:         PropTypes.string,
    isActive:          PropTypes.bool,
    activeComponent:   PropTypes.func,
    inactiveComponent: PropTypes.func,
    children:          function (props, propName, componentName) {
        const children = props[propName];
        let error      = null;
        if (React.Children.count(children) > 2) {
            error = new Error("Can only have two children (which should be Active or Inactive components)");
        } else {
            React.Children.forEach(children,
                                   (child: React.ComponentElement) => {
                                       if (child.type !== ActiveComponent && child.type !== InactiveComponent) {
                                           error = new Error('`' + componentName + '` children should be either an Active or Inactive Component`.');
                                       }
                                   });
        }
        return error
    }
};