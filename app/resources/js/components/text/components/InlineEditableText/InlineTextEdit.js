import PropTypes from "prop-types";
import React, {Component} from "react";
import * as utility from '../../../../utility'

export default class InlineTextEdit extends Component {
    setText;
    setEditState;
    _id;
    
    constructor(props) {
        super(props);
        this.setText      = (props.setText || (event => {}));
        this.setEditState = (props.setEditState || (event => {}));
        this._id          = utility.randomString();
    }
    
    render() {
        const text   = this.props.text || '';
        const onBlur = event => {
            this.setText(event.target.value);
            this.setEditState(false);
        };
        
        const className = this.props.className;
        
        return (<input autoFocus
        
                       className={className}
        
                       type="text"
                       ref="input"
        
                       defaultValue={text}
        
                       onBlur={onBlur} />);
        
    }
}

InlineTextEdit.propTypes = {
    
    setText:      PropTypes.func,
    setEditState: PropTypes.func,
    text:         PropTypes.string,
    
    className: PropTypes.string
};

export {InlineTextEdit};