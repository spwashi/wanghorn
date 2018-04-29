import React from "react"
import * as PropTypes from "prop-types"
import {SelectivelyActive} from "../../../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../../../components/selectivelyActive/components";
import Modal from "../../../../../../../components/modal";
import AttrValue from "../../../../../components/configuration/attribute/value";
import {ConfigurationAttribute} from "../../../../../components/configuration";

class NavigationModal extends React.Component {
    render() {
        let {path, inputValues, isOpen, onRequestClose, onRequestNavigate, handleChange, validators, updatedPath} = this.props;
        let onSubmit                                                                                              = event => {
            event.preventDefault();
            return onRequestNavigate();
        };
        return (
            <Modal key="modal" isOpen={isOpen} onRequestClose={onRequestClose} title={`${updatedPath || path}`} contentLabel={`Navigate to ${path}`}>
                <form onSubmit={onSubmit}>
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
                    <button>Navigate</button>
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
    
    beginNavigation(validators, path) {
        if (Object.entries(validators).length) {
            this.setState({isNavigationBegun: true},);
        } else {
            this.followPath(path);
        }
    };
    
    followPath(path) {
        let location = this.getLocation(path);
        const win    = window.open(`/${location}`, '_blank');
        win.focus && win.focus();
    }
    
    getLocation(path, skipIfEmpty) {
        let location = path;
        if (path[path.length - 1] === '$') {
            location = path.substr(0, path.length - 1);
        }
        for (const variable in this.state.inputs) {
            if (!this.state.inputs.hasOwnProperty(variable)) continue;
            
            let val = this.state.inputs[variable] || '';
            if (!(val = val.trim()).length && skipIfEmpty) continue;
            location = location.replace(variable, val);
        }
        console.log(location);
        return location;
    }
    
    render() {
        const {name, path, validators} = this.props;
        return (
            <div key='name' className="route--identifier">
                <div className="name route--name">{name}</div>
                <div key={"path"} className="path route--path" onClick={event => event.shiftKey && this.beginNavigation(validators, path)}>
                    {path}
                    <NavigationModal key={"navigation-modal"}
                                     path={path}
                                     updatedPath={this.state.updatedPath}
                                     isOpen={this.state.isNavigationBegun}
                                     onRequestNavigate={event => {
                                         return this.followPath(path);
                                     }}
                                     validators={validators}
                                     inputValues={this.state.inputs}
                                     onRequestClose={e => this.setState({isNavigationBegun: false})}
                                     handleChange={
                                         ({variable, value}) => {
                                             return this.setState({inputs: {...this.state.inputs, [variable]: value}},
                                                                  () => {
                                                                      this.setState({updatedPath: this.getLocation(path, true)})
                                                                  });
                                         }} />
                </div>
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
        let route            = this.props.route;
        let name             = this.props.name;
        let validators       = {};
        let path             =
                (route.requestDescriptor ? route.requestDescriptor.original : '')
                    .split('/')
                    .map(pathPart => {
                        let variable = /({[a-zA-Z0-9_]+}):*(.*)/.exec(pathPart);
                        if (variable && variable[1]) {
                            validators[variable[1]] = variable[2];
                            return variable[1];
                        }
                        return pathPart;
                    })
                    .join('/');
        const routeNameProps = {validators, path, name};
        return (
            <SelectivelyActive className="route--wrapper" matchTarget={target => target.classList.contains('route--identifier')}>
                <ActiveComponent component={props => [<RouteName key='route-name' {...routeNameProps} />,
                                                      <Configuration {...props} key='route-configuration' />]}
                                 key='configuration'
                                 route={route} />
                <InactiveComponent component={RouteName} {...routeNameProps} />
            </SelectivelyActive>
        )
    }
}
