// meant to  serve as a state machine
import React from "react"
import * as PropTypes from "prop-types"
import State from "./state";

class Stateful extends React.Component {
    previousState = null;
    
    constructor(props) {
        super(props);
        const {activeState} = props;
        this.state          = {activeState}
    }
    
    render() {
        const children  = this.props.children || [];
        let activeChild = null;
        let activeState = this.props.activeState;
        console.log(activeState);
        children.forEach((child: State) => {
            if (child.props.name !== activeState) return;
            activeChild = child;
        });
        return activeChild;
    }
}

export default Stateful;
Stateful.propTypes = {
    activeState:       PropTypes.string,
    onTransitionBegin: PropTypes.func,
    onTransitionEnd:   PropTypes.func,
    
    children: (props, propName, componentName) => {
        const children = props[propName];
        let error      = null;
        React.children.forEach(children,
                               (child: React.ComponentElement) => {
                                   if (child.type !== State) {
                                       error = new Error("Can only have States as children to a " + componentName);
                                   }
                               });
        return error;
    }
};
