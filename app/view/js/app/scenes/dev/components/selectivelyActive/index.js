import React, {Component} from "react";

class SelectivelyActive extends Component {
    _activeComponent;
    _inactiveComponent;
    
    _cancelClick = false;
    
    matchTarget() {
        return true;
    }
    
    constructor(props: { isActive: boolean | undefined, trigger: "click" }) {
        super(props);
        this._activeComponent   = props.activeComponent;
        this._inactiveComponent = props.inactiveComponent || (() => <div />);
        this.matchTarget        = props.matchTarget || this.matchTarget;
        this.state              = {
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
        let className      = `${(this.props.className || '')} ${(this.state.isActive ? 'active' : 'inactive')}`;
        let InnerComponent = ({active}) => {
            const InactiveComponent = this._inactiveComponent;
            const ActiveComponent   = this._activeComponent;
            return active ? <ActiveComponent /> : <InactiveComponent />;
        };
        return (
            <div className={className + ' selectively-active'}
                 onClick={this.handleClick.bind(this)}
                 onMouseDown={this.handleMouseDown.bind(this)}
                 onMouseUp={this.handleMouseUp.bind(this)}
                 onMouseMove={this.handleMouseMove.bind(this)}
            >
                <InnerComponent active={this.state.isActive} />
            </div>
        );
    }
}

export default SelectivelyActive;