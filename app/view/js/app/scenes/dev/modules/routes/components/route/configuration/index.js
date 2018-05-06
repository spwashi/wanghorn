import React from "react"
import * as PropTypes from "prop-types"
import {SelectivelyActive} from "../../../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../../../components/selectivelyActive/components";
import Modal from "../../../../../../../components/modal";
import AttrValue from "../../../../../components/configuration/attribute/value";
import {ConfigurationAttribute} from "../../../../../components/configuration";
import {getCleanPath, getURI} from "../../../../../../../../path/resolution";

class NavigationModal extends React.Component {
    render() {
        let {path, inputValues, isOpen, onRequestClose, onRequestNavigate, handleChange, canNavigate, validators, updatedPath} = this.props;
        let onSubmit                                                                                                           = event => {
            event.preventDefault();
            return onRequestNavigate();
        };
        return (
            <Modal key="modal" isOpen={isOpen} onRequestClose={onRequestClose} title={`${updatedPath || path}`} contentLabel={`Navigate to ${path}`}>
                <form onSubmit={onSubmit} className={"route--navigation--form"}>
                    {
                        Object.entries(validators || {}).map(([variable, regex], i) => {
                            return (
                                <div key={variable} className="input--wrapper">
                                    <label htmlFor={variable}>{variable}</label>
                                    <input type="text"
                                           autoFocus={i === 0}
                                           placeholder={variable}
                                           value={inputValues[variable] || ''}
                                           onChange={e => {
                                               let value = e.target.value;
                                               handleChange({variable, value});
                                           }} />
                                </div>
                            )
                        })
                    }
                    <a href={canNavigate ? (updatedPath || path) : null} target={'_blank'} onKeyDown={event => {
                        event.keyCode === 32 && onSubmit(event);
                    }} className={'navigate ' + (canNavigate
                                                 ? 'active'
                                                 : 'disabled')}>Navigate</a>
                </form>
            </Modal>)
    };
}

let Configuration = ({route}) =>
    <div className="route--configuration">
        {Object.entries(route)
               .map(([attr, value]) => {
                   if (attr === "parameters" && Array.isArray(value) && !value.length) {
                       return;
                   } else if (attr === "requestDescriptor") {
                       return (
                           !value || typeof value !== "object" ? null
                                                               :
                           <ConfigurationAttribute title={attr.replace(/([A-Z][a-z])/g, ' $1').replace(/_/g, ' ').trim()} key={attr} ownerType={"route"} attribute={attr}>
                               <div>
                                   <table>
                                       <tbody>
                                       {
                                           Object.entries(value).map(([attr, val]) =>
                                                                         val === null || Array.isArray(val) && !val.length ? undefined
                                                                                                                           :
                                                                         <tr key={attr}>
                                                                             <td className={"attribute"}>{attr.replace(/_/g, ' ')}</td>
                                                                             <td className={"value"}><AttrValue value={val} attr={attr} /></td>
                                                                         </tr>)
                                       }
                                       </tbody>
                                   </table>
                               </div>
                           </ConfigurationAttribute>
                       )
                   }
                   return <ConfigurationAttribute title={attr.replace(/([A-Z][a-z])/g, ' $1').replace('_', ' ').trim()} key={attr} ownerType={"route"} attribute={attr} value={value} />;
               })}
    </div>;

class RouteName extends React.Component {
    state = {
        isNavigationBegun: false,
        inputs:            {}
    };
    
    constructor(props) {
        super(props);
        this.state.updatedPath = this.getLocation(props.name, true, '');
    }
    
    beginNavigation() {
        this.setState({isNavigationBegun: true});
    };
    
    followPath(path) {
        let location = this.getLocation(path);
        const win    = window.open(`${location}`, '_blank');
        win.focus && win.focus();
    }
    
    getLocation(name, skipIfEmpty, root) {
        let args    = this.state.inputs;
        let options = {skipEmpty: skipIfEmpty};
        if (root) options.root = root;
        return getURI(name, args, options);
    }
    
    render() {
        const {name, path, validators} = this.props;
        let canNavigate                = () => {try {return !!this.getLocation(name, false)} catch (e) {return false;}};
        return (
            <div key='name' className="route--identifier selectively-active--toggle">
                <div className="name route--name">{name}</div>
                <div key={"path"} className="path route--path">
                    {path}
                    <NavigationModal key={"navigation-modal"}
                                     path={path}
                                     updatedPath={this.state.updatedPath}
                                     isOpen={this.state.isNavigationBegun}
                                     onRequestNavigate={event => this.followPath(name)}
                                     validators={validators}
                                     inputValues={this.state.inputs}
                                     canNavigate={canNavigate()}
                                     onRequestClose={e => this.setState({isNavigationBegun: false})}
                                     handleChange={
                                         ({variable, value}) => {
                                             return this.setState({inputs: {...this.state.inputs, [variable]: value}},
                                                                  () => {
                                                                      this.setState({updatedPath: this.getLocation(name, true, '')})
                                                                  });
                                         }} />
                </div>
                {
                    this.state.updatedPath ? <button key={"navigate"}
                                                     className={"route--navigate"}
                                                     onClick={event => {this.beginNavigation()}}>
                                               Navigate
                                           </button> :
                    null
                }
                <button key={"toggle-active"} tabIndex={-1} className={"selectively-active--toggle"}>Toggle</button>
            </div>)
    }
};

export default class RouteConfiguration extends React.Component {
    static propTypes    = {
        route: PropTypes.object.isRequired,
        name:  PropTypes.string
    };
    static defaultProps = {
        route: {requestDescriptor: {original: null, arguments: null, path: null}}
    };
           state        = {
               isNavigationBegun: false,
               inputs:            {}
           };
    
    render() {
        let route              = this.props.route;
        let name               = this.props.name;
        let {path, validators} = getCleanPath(route.requestDescriptor ? route.requestDescriptor.original : '');
        const routeNameProps   = {validators, path, name};
        return (
            <SelectivelyActive className="route--wrapper"
                               matchTarget={target => target.classList.contains('selectively-active--toggle')}>
                <ActiveComponent component={props => [<RouteName key='route-name' {...routeNameProps} />,
                                                      <Configuration {...props} key='route-configuration' />,
                ]}
                                 key='configuration'
                                 route={route} />
                <InactiveComponent component={props => [<RouteName key={'route-name'}{...props} />]} {...routeNameProps} />
            </SelectivelyActive>
        )
    }
}
