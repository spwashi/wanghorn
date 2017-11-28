import React, {Component} from "react";
import PropTypes from "prop-types"
import {AnchorLabel} from "./AnchorLabel"
import {CHAR_CODES} from "../../../constants";

/**
 * Anchors serve as the Identity of a Concept
 */
class Anchor extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isEdit: false,
            label:  null
        };
    }
    
    handleClick(event) {this.toggleLabelEdit();}
    
    handleKeyDown(event) {
        const charCode = event.charCode || event.keyCode;
        
        switch (charCode) {
            case CHAR_CODES.ESCAPE: //escape key
                
                // this only gets us out of edit mode
                if (!this.state.isEdit) return;
                
                this.setState({isEdit: false});
                
                break;
            
            case CHAR_CODES.BACKSPACE:
                // If we aren't already in edit mode, don't clear the whole thing on backspace
                if (this.state.isEdit) return;
                
                this.setState({label: '', edit: true});
                
                break;
            
            case CHAR_CODES.SPACE:
                if (this.state.isEdit) {
                    event.preventDefault();
                    return;
                }
                
                this.toggleLabelEdit();
                
                break;
            
            case CHAR_CODES.TAB:
                return;
            
            default:
                if (this.state.isEdit) return;
                
                this.toggleLabelEdit();
                
                break;
        }
    }
    
    toggleLabelEdit() {
        this.setState({isEdit: !this.state.isEdit});
    }
    
    render() {
        const onBlur    = value => this.setState({isEdit: false, label: value || ''});
        const anchorID  = this.props.anchorID;
        const onKeyDown = this.handleKeyDown.bind(this);
        const onClick   = this.handleClick.bind(this);
        return (
            <div className="anchor" data-id={anchorID} onKeyDown={onKeyDown} onClick={onClick}>
                <div className="anchor--control">
                    <div className="anchor--control--delete">X</div>
                </div>
                <div className="anchor--ampersand"></div>
                <div className="anchor--label--wrapper" tabIndex={0}>
                    <AnchorLabel isEdit={this.state.isEdit} label={this.state.label} onBlur={onBlur} />
                </div>
            </div>
        );
    }
}

Anchor.propTypes = {
    anchorID: PropTypes.string.isRequired
};

export {Anchor}
export default Anchor;