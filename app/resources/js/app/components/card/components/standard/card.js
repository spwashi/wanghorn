import React from 'react';
import PropTypes from 'prop-types';
import * as utility from "../../../../utility";

const StandardCardLabelText = ({isEdit, label, onComplete}) => {
    return <div>HELLO FRIEND</div>
};

const StandardCard = ({labelImage, labelText, controllers}) => {
    const controllerMap = utility.objectToMap();
    
    const onClick   = () => {};
    const onKeyDown = () => {};
    
    return (
        <div className="card-standard" onKeyDown={onKeyDown} onClick={onClick}>
            <div className="anchor--control">
                <div className="anchor--control--delete">X</div>
                {
                    controllerMap.entries()
                                 .map((k, v) => {
                                     return <div>{k} {v}</div>
                                 })
                }
            </div>
            <div className="anchor--ampersand"></div>
            <div className="anchor--label--wrapper" tabIndex={0}>
                <AnchorLabelText isEdit={this.state.isEdit} label={this.state.label} onBlur={onBlur} />
            </div>
        </div>
    )
};

StandardCard.propTypes = {
    labelImage: PropTypes.element,
    labelText:  PropTypes.string,
    
    controllers: PropTypes.shape({
                                     editCardLabel:  PropTypes.func,
                                     clearCardLabel: PropTypes.func,
        
                                     deleteCardItem: PropTypes.func,
                                 })
};