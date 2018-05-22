import React, {Component} from "react";
import * as PropTypes from "prop-types";
import Stateful from "../stateful/stateful";
import State from "../stateful/state";
import bind from "bind-decorator";
import {ActiveComponent, InactiveComponent} from "./components";

class SelectivelyActive extends Component {
    active;
    inactive;
    _cancelClick = false;
    
    constructor(props) {
        super(props);
        this.matchTarget = props.matchTarget || this.matchTarget;
        const isActive   = props.isActive;
        this.state       = {
            isActive,
            isDeactivating: false
        }
    }
    
    matchTarget(target) {
        if (target === this.active || target === this.inactive) return true;
        const {active, inactive} = this.getChildren();
        return !this.active && !this.inactive;
    }
    
    @bind
    handleMouseMove(e) {
        if (!this.props.trigger === "click") return;
        if (!this._mouseDown) return;
        const current  = {x: e.screenX, y: e.screenY};
        const distance =
                  Math.sqrt(
                      Math.pow(this._mouseDown.x - current.x, 2) + Math.pow(this._mouseDown.y - current.y, 2)
                  );
        if (distance > 25) {
            this._cancelClick = true;
        }
    }
    
    @bind
    handleMouseDown(e) {
        this._cancelClick = false;
        if (!this.props.trigger === "click") return;
        this._mouseDown = {x: e.screenX, y: e.screenY};
    }
    
    @bind
    handleMouseUp(e) {
        if (!this.props.trigger === "click") return;
        this._mouseDown = null;
    }
    
    @bind
    handleClick(event) {
        let result = this.props.onClick && this.props.onClick(event);
        if (result === false) return false;
        if (this.props.trigger !== "click") return;
        if (this._cancelClick) return;
        const target = event.target;
        if (this.matchTarget(target)) {
            this.toggleActive();
            event.stopPropagation();
        }
    }
    
    toggleActive() {
        this.blurWrapper();
        if (this.state.isActive) {
            this.beginClose()
        } else {
            this.beginOpen()
        }
    }
    
    @bind
    handleKeyDown(event) {
        const keyCode = event.keyCode;
        switch (keyCode) {
            case 32:
            case 13:
                if (event.target !== this.selectivelyActiveWrapper) return;
                this.toggleActive();
                event.stopPropagation();
                event.preventDefault();
                break;
        }
    }
    
    blurWrapper() {this.selectivelyActiveWrapper.blur()}
    
    focusWrapper() {this.selectivelyActiveWrapper.focus()}
    
    beginClose() {
        const handleDeactivationAttempt = this.props.handleDeactivationAttempt || (() => {});
        let onStateSet                  = () =>
            Promise.resolve(handleDeactivationAttempt({active: this.active, inactive: this.inactive}))
                   .then(i => this.setState({isDeactivating: false, isActive: false}, this.focusWrapper));
        this.setState({isDeactivating: true}, onStateSet);
    }
    
    beginOpen() {
        const handleActivationAttempt = this.props.handleActivationAttempt || (() => {});
        let onStateSet                = () =>
            Promise.resolve(handleActivationAttempt({active: this.active, inactive: this.inactive}))
                   .then(i => this.setState({isActivating: false, isActive: true}, this.focusWrapper));
        this.setState({isActivating: true}, onStateSet);
    }
    
    render() {
        let activeString   = this.state.isActive ? 'active' : 'inactive';
        let inactiveString = !this.state.isActive ? 'active' : 'inactive';
        let activityStatus = [activeString];
        if (this.state.isActivating || this.state.isDeactivating) {
            activityStatus.push(inactiveString);
        }
        let className = `${this.props.className || ''} ${activityStatus}`;
        this.state.isDeactivating && (className += " is-deactivating");
        this.state.isActivating && (className += " is-activating");
        let {inactiveChild, activeChild}                      = this.getChildren();
        let {component: ActiveChild, ...activeChildProps}     = activeChild.props;
        let {component: InactiveChild, ...inactiveChildProps} = inactiveChild.props;
        return (
            <div className={className + ' selectively-active'}
                 ref={el => this.selectivelyActiveWrapper = el}
                 tabIndex={!this.state.isDeactivating && !this.state.isActivating ? 0 : -1}
                 onClick={this.handleClick}
                 onKeyDown={this.handleKeyDown}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseMove={this.handleMouseMove}>
                <Stateful activeStates={activityStatus}>
                    <State name={'active'}>
                        <ActiveChild activeElRef={el => this.active = el} {...(activeChildProps || {})} />
                    </State>
                    <State name={'inactive'}>
                        <InactiveChild activeElRef={el => this.inactive = el} {...(inactiveChildProps || {})} />
                    </State>
                </Stateful>
            </div>
        );
    }
    
    getChildren() {
        let inactiveChild;
        let activeChild;
        React.Children.forEach(this.props.children || [],
            (child: React.ComponentElement) => {
                if (child.type === ActiveComponent) {activeChild = child;}
                if (child.type === InactiveComponent) {inactiveChild = child;}
            });
        return {inactiveChild, activeChild};
    }
}

export {SelectivelyActive};
SelectivelyActive.propTypes    = {
    trigger:                   PropTypes.oneOf(["click"]),
    matchTarget:               PropTypes.func,
    handleDeactivationAttempt: PropTypes.func,
    handleActivationAttempt:   PropTypes.func,
    onUpdateActivationStatus:  PropTypes.func,
    className:                 PropTypes.string,
    isActive:                  PropTypes.bool,
    children:                  function (props, propName, componentName) {
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
SelectivelyActive.defaultProps = {isActive: false, trigger: 'click'};