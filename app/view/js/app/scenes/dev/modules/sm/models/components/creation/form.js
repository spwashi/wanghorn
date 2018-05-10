import React from "react"
import * as PropTypes from "prop-types"
import {getTitleFromPropName, normalizeSmID} from "../../../utility";
import bind from "bind-decorator";
import axios from "axios";
import {reduceEntriesIntoObject} from "../../../../../../../../utility";

export class SmEntityCreationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state               = {_status: null};
        const smEntity           = this.props.config;
        const settableProperties = this.getSettableProperties(smEntity.properties);
        Object.entries(settableProperties)
              .forEach(([propName, property]) => this.state[propName] = property.defaultValue || '')
    }
    
    @bind
    handleSubmit(event) {
        event.preventDefault();
        
        let url = this.props.url;
        this.setState({_status: 'loading'},
                      () => {
                          let post = Object.entries(this.state)
                                           .filter(([name]) => name[0] !== '_')
                                           .reduce(reduceEntriesIntoObject, {});
                          axios.post(url, post)
                               .then(({data}) => {
                                   const status = data.success ? 'success' : 'error';
                                   this.setState({_status: status});
                                   console.log(data);
                               })
                      })
    }
    
    render() {
        const smEntity     = this.props.config;
        const {properties} = smEntity;
        
        if (!properties) {
            throw new Error("Can only prompt for SmEntities that have Properties");
        }
        
        let settableProperties = this.getSettableProperties(properties);
        return (
            <form onSubmit={this.handleSubmit} className={this.state._status ? 'status__' + this.state._status : ''}>
                {
                    Object.entries(settableProperties)
                          .map(([propertyName, property]) => {
                              let inputType       = "text";
                              let pattern         = null;
                              let onKeyDown;
                              let normalizedSmID  = normalizeSmID(property.smID);
                              let value           = this.state[propertyName];
                              let propertyIsEmail = propertyName.toLowerCase()
                                                                .substr(propertyName.length - "email".length) === "email";
                              if (propertyIsEmail) {
                                  inputType = "email";
                                  pattern   = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$";
                                  onKeyDown =
                                      event => {
                                          if (event.keyCode === 32) event.preventDefault();
                                      }
                              }
                              if (propertyName.indexOf('_id') > 0 || propertyName === 'id' || (property.datatypes || []).indexOf('int') > -1) {
                                  inputType = "number";
                                  pattern   = null;
                              }
                        
                              let input = <input type={inputType}
                                                 onKeyDown={onKeyDown}
                                                 onChange={e => {
                                                     let val = e.target.value;
                            
                                                     if (propertyIsEmail) {
                                                         if (val && !/[a-zA-Z0-9._%+-@]+$/.test(val)) {
                                                             return;
                                                         }
                                                     }
                            
                                                     this.setState({[propertyName]: val})
                                                 }}
                                                 value={value}
                                                 pattern={pattern}
                                                 key={normalizedSmID}
                                                 name={propertyName} />;
                              return (
                                  <div key={normalizedSmID} className={"input--wrapper " + propertyName + '--wrapper'}>
                                      <label htmlFor={propertyName}>{getTitleFromPropName(propertyName)}</label>
                                      {input}
                                  </div>
                              )
                          })
                }
                <button type="submit">Submit</button>
            </form>
        )
    }
    
    getSettableProperties(properties) {
        return Object.entries(properties)
                     .filter(([name, prop]) => !prop.isGenerated)
                     .reduce((all, entry) => {
                         const [k, v] = entry;
                         all[k]       = v;
                         return all;
                     }, {});
    }
}

SmEntityCreationForm.propTypes = {
    url:    PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
};