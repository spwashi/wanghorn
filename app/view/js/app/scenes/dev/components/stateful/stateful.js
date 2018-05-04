// meant to  serve as a state machine
import React from "react"
import * as PropTypes from "prop-types"
import State from "./state";

class Stateful extends React.Component {
    render() {
        const children     = this.props.children || [];
        let activeChildren = [];
        let activeState    = Array.isArray(this.props.activeStates) ? this.props.activeStates : [this.props.activeStates];
        children.forEach(
            (child: State) => {
                if (activeState.indexOf(child.props.name) < 0) return;
                activeChildren.push(child);
            });
        return activeChildren;
    }
}

export default Stateful;
Stateful.propTypes    = {
    activeStates:      PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    onTransitionBegin: PropTypes.func,
    onTransitionEnd:   PropTypes.func,
    
    setStateRefs: PropTypes.func,
    
    children: (props, propName, componentName) => {
        const children = props[propName];
        let error      = null;
        React.Children.forEach(children,
                               (child: React.ComponentElement) => {
                                   if (child.type !== State) {
                                       error = new Error(`Can only have States as children to a ${componentName} -- ${child.type || typeof child} given`);
                                   }
                               });
        return error;
    }
};
Stateful.defaultProps = {
    setStateRefs: () => {}
};