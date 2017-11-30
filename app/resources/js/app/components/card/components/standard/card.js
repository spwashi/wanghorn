import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as utility from "../../../../utility";
import {InlineEditableText} from "../../../text";

class StandardCard extends Component {
    render() {
        
        // props
        let labelImage = this.props.labelImage;
        let className  = (this.props.className || '') + ' card card-standard';
        let labelText  = this.props.labelText;
        
        let isEdit = false;
        
        //events
        const onClickCard = () => {};
        const onKeyDown   = () => {};
        const onBlur      = () => {};
        
        return (
            <div className={className} onClick={onClickCard}>
                {this.props.children}
            </div>
        )
        
    }
}

StandardCard.propTypes = {
    labelImage: PropTypes.element,
    labelText:  PropTypes.string,
    
    controllers: PropTypes.shape({
                                     editCardLabel:  PropTypes.func,
                                     clearCardLabel: PropTypes.func,
        
                                     deleteCardItem: PropTypes.func,
                                 })
};

export default StandardCard;
export {StandardCard};