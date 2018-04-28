import React from "react"
import * as PropTypes from "prop-types"
import {getTitleFromPropName, normalizeSmID} from "../../../utility";
import bind from "bind-decorator";
import axios from "axios";
import {get_CREATE_MODEL} from "../../../../../paths";

export class ModelCreationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state               = {};
        const settableProperties = this.getSettableProperties(this.props.model.properties);
        Object.entries(settableProperties)
              .forEach(([propName, property]) => this.state[propName] = property.defaultValue || '')
    }
    
    @bind
    handleSubmit(event) {
        event.preventDefault();
        let url = get_CREATE_MODEL({smID: this.props.smID});
        axios.post(url, this.state)
             .then(({data}) => {
                 console.log(data);
             })
    }
    
    render() {
        const model            = this.props.model;
        const {properties}     = model;
        let settableProperties = this.getSettableProperties(properties);
        return (
            <form onSubmit={this.handleSubmit}>
                {
                    Object.entries(settableProperties)
                          .map(([propertyName, property]) => {
                              let inputType       = "text";
                              let pattern         = null;
                              let onKeyDown;
                              let normalizedSmID  = normalizeSmID(property.smID);
                              let value           = this.state[propertyName];
                              let propertyIsEmail = propertyName.toLowerCase().substr(propertyName.length - "email".length) === "email";
                              if (propertyIsEmail) {
                                  inputType = "email";
                                  pattern   = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
                                  onKeyDown = event => {
                                      if (event.keyCode === 32) event.preventDefault();
                                  }
                              } else if (property.datatypes.indexOf('int') > -1) {
                                  inputType = "number";
                              }
                              let input = <input type={inputType}
                                                 onKeyDown={onKeyDown}
                                                 onChange={e => {
                                                     let val = e.target.value;
                            
                                                     if (propertyIsEmail) {
                                                         if (val && !/[a-z0-9._%+-@]+$/.test(val)) {
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

ModelCreationForm.propTypes = {
    smID:  PropTypes.string.isRequired,
    model: PropTypes.object.isRequired
};