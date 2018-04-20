import React from "react"
import * as PropTypes from "prop-types"

class State extends React.Component {
    beginTransitionTo(stateName, updateProgress) {
        let handleTransitionTo = this.props.onTransitionToBegin || (() => {});
        let transitionHandled  = handleTransitionTo(stateName, updateProgress);
        return Promise.resolve(transitionHandled)
                      .then(result => {
                          // complete "update progress" function
                          updateProgress(true);
                          return this.endTransitionTo(stateName)
                      });
    }
    
    endTransitionTo(stateName) {
        let handleTransitionTo = this.props.onTransitionToBegin || (() => {});
        let transitionHandled  = handleTransitionTo(stateName);
        return Promise.resolve(transitionHandled)
    }
    
    render() {
        const {children} = this.props;
        return children || null;
    }
}

export default State;
State.propTypes = {
    name: PropTypes.string.isRequired,
    
    onTransitionToBegin: PropTypes.func,
    onTransitionTo:      PropTypes.func,
    
    onTransitionFromBegin: PropTypes.func,
    onTransitionFrom:      PropTypes.func,
    
    children: PropTypes.element
};