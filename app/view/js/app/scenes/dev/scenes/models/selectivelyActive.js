import React, {Component} from "react";

export class SelectivelyActiveComponent extends Component {
    _activeComponent;
    _inactiveComponent;
    
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
            trigger:  props.trigger
        }
    }
    
    handleClick(event) {
        console.log(this.props.trigger);
        
        if (this.props.trigger === "click") {
            const target = event.target;
            console.log(target);
            
            if (this.matchTarget(target)) {
                this.setState({isActive: !this.state.isActive});
                event.stopPropagation();
            }
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
            <div className={className + ' selectively-active'} onClick={this.handleClick.bind(this)}>
                <InnerComponent active={this.state.isActive} />
            </div>
        );
    }
}

export default SelectivelyActiveComponent;