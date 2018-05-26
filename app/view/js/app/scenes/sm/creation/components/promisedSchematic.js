import React from "react"
import * as PropTypes from "prop-types"

export class PromisedComponent extends React.Component {
    static propTypes   = {promised: PropTypes.object.isRequired};
           isUnmounted = false;
    
    constructor(props) {
        super(props);
        let hasResolved;
        let promised = props.promised;
        Object.entries(typeof promised === "object" && promised)
              .forEach(([i, val]) => {
                  if (hasResolved === false) return;
            
                  let isPromise  = typeof val === 'object' && val && typeof val.then === "function";
                  let isFunction = typeof val === "function";
            
                  if (isPromise || isFunction) return hasResolved = false;
              });
        
        if (typeof hasResolved === 'undefined') hasResolved = true;
        
        this.state = {
            hasResolved,
            attemptedResolve: false,
            promised:         hasResolved ? promised : null
        };
    }
    
    componentWillUnmount() { this.isUnmounted = true;};
    
    componentDidMount() {
        this.isUnmounted = false;
        if (this.state.hasResolved) return;
        
        let keys            = Object.keys(this.props.promised);
        let values          = Object.values(this.props.promised);
        let resolvingValues = values.map(i => typeof i === "function" ? i() : i);
        
        Promise.all(resolvingValues)
               .then(items => {
                   let promised = {};
                   items.forEach(function (item, i) { return promised[keys[i]] = item; });
            
                   if (this.isUnmounted) return;
            
                   this.setState({promised, hasResolved: true, attemptedResolve: true});
               })
               .catch(e => {
                   if (this.isUnmounted) return;
            
                   this.setState({hasResolved: false, attemptedResolve: true})
               })
    }
    
    render() {
        const {children, promised: originalPromises, ...props} = this.props;
        const ResolvedItem                                     = children;
        const {promised}                                       = this.state;
        return this.state.hasResolved ? <ResolvedItem key={'schematic'} {...props} {...promised} />
                                      : (this.state.attemptedResolve ? 'Could not resolve configuration'
                                                                     : 'Loading...');
    }
}