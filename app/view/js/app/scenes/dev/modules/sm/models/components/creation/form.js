import React from "react"
import * as PropTypes from "prop-types"
import {getTitleFromPropName} from "../../../utility";

export class ModelCreationForm extends React.Component {
    render() {
        const model        = this.props.model;
        const {properties} = model;
        return (
            <form action="">
                {
                    Object.entries(properties)
                          .filter(([name, prop]) => !prop.isGenerated)
                          .map(([propertyName, property]) => {
                              console.log(property);
                              return (
                                  <div key={propertyName} className={"input--wrapper " + propertyName + '--wrapper'}>
                                      <label htmlFor={propertyName}>{getTitleFromPropName(propertyName)}</label>
                                      <input type="text" key={property.smID} name={propertyName} />
                                  </div>
                              )
                          })
                }
            </form>
        )
    }
}

ModelCreationForm.propTypes = {
    smID:  PropTypes.string,
    model: PropTypes.object
};