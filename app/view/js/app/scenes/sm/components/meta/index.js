import React from "react";
import {Route} from "react-router-dom";
import * as PropTypes from "prop-types"
import {getReactPath, getURI} from "../../../../../path/resolution";
import {parseSmID} from "../../utility";
import {CreateSmEntityDialog} from "../form/creation/components/dialog";
import {LinkItem} from "../../../../../components/navigation";

class SmEntityMetaComponent extends React.Component {
    render() {
        return <div className="wrapper component--wrapper smEntity--component--wrapper">{this.props.children}</div>
    }
};
const Action = ({action}) => {
    const {uri, title, callback, canExecute} = action;
    if (!canExecute && typeof canExecute !== "undefined") return null;
    let actionBody;
    if (uri) {
        actionBody = <LinkItem to={uri} className={'button'} isButton={true}>{title}</LinkItem>;
    } else if (callback) {
        actionBody = <button onClick={callback}>{title}</button>
    }
    return <div className="smEntity--meta--action--wrapper">{actionBody}</div>
};

class SmEntityMetaActionContainer extends React.Component {
    render() {
        return (
            <div className="smEntity--meta--action--container">
                {
                    Object.entries(this.props.actions)
                          .map(entry => {
                              const [name, action] = entry;
                              return <Action key={name} action={action} />
                          })
                }
            </div>
        )
    }
}

SmEntityMetaActionContainer.propTypes = {};

class SmEntityMeta extends React.Component {
    render() {
        const {schematic, smEntity}      = this.props;
        let smID                         = this.props.smID || schematic.smID;
        const {manager: ownerType, name} = parseSmID(smID || schematic);
        
        
        
        return (
            <div key={smID} className={"smEntity--meta"}>
                <header><h3 id={smID} className={"title smEntity--smID"}>{smID}</h3></header>
                <SmEntityMetaActionContainer actions={this.props.actions} />
                {(Array.isArray(this.props.children) ? this.props.children : [this.props.children]).map((child, i) => <SmEntityMetaComponent key={i}>{child}</SmEntityMetaComponent>)}
                
            </div>
        );
    }
}

SmEntityMeta.propTypes = {
    smID:      PropTypes.string,
    schematic: PropTypes.object.isRequired,
    smEntity:  PropTypes.object,
    actions:   PropTypes.object,
    config:    PropTypes.object.isRequired,
};

export default SmEntityMeta;