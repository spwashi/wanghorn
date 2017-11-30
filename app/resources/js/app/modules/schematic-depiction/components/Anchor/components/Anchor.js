import React, {Component} from "react";
import PropTypes from "prop-types"
import {StandardCard} from "../../../../../components/card";
import {InlineEditableText} from "../../../../../components/text";

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
    
    render() {
        return (
            this.renderCard()
        );
    }
    
    renderCard() {
        const setText      = state => {this.setState((previous, props) => ({label: state}))};
        const setEditState = state => {this.setState((previous, props) => ({isEdit: state}))};
        
        return (
            <StandardCard className="anchor">
                <div className="anchor--control">
                    <div className="anchor--control--delete">X</div>
                </div>
                <div className="anchor--label--wrapper">
                    <InlineEditableText className="card--label"
                    
                                        isEdit={this.state.isEdit}
                                        text={this.state.label}
                    
                                        setEditState={setEditState}
                                        setText={setText}
                    />
                </div>
            </StandardCard>
        );
    }
}

Anchor.propTypes = {
    anchorID: PropTypes.string.isRequired
};

export {Anchor}
export default Anchor;