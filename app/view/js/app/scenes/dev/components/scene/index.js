import React from "react"
import * as PropTypes from "prop-types"
import {SelectivelyActive} from "../selectivelyActive";
import {InactiveComponent} from "../selectivelyActive/components";

function getActivationAnimationPromise(isActivating) {
    return els => {
        const {inactive, active} = els;
        let enteringElement, exitingElement;
        if (isActivating) {
            enteringElement = active;
            exitingElement  = inactive;
        } else {
            enteringElement = inactive;
            exitingElement  = active;
        }
        let parentElement = exitingElement.parentElement;
        let timeout       = 350;
        return new Promise(resolve => {
            let i                               = 0, interval_id;
            let {...originalInactiveStyle}      = exitingElement.style;
            let {...originalActiveStyle}        = enteringElement.style;
            let {...originalParentElementStyle} = parentElement.style;
            
            const exiting                = exitingElement.getBoundingClientRect();
            const entering               = enteringElement.getBoundingClientRect();
            const parent                 = parentElement.getBoundingClientRect();
            const parentHeightDifference = exiting.height - entering.height;
            
            const parentTempStyles   = {
                height:   `${exiting.height}px`,
                position: 'relative'
            };
            const exitingTempStyles  = {
                position: 'relative',
                left:     '0',
                top:      0,
                width:    exiting.width + 'px', maxWidth: exiting.width + 'px', minWidth: exiting.width + 'px',
                height:   exiting.height + 'px', maxHeight: exiting.height + 'px', minHeight: exiting.height + 'px',
                zIndex:   -2,
            };
            const enteringTempStyles = {
                position:    'absolute',
                zIndex:      -1,
                marginRight: 'auto',
                marginLeft:  'auto',
                top:         '100%',
                width:       entering.width + 'px', maxWidth: entering.width + 'px', minWidth: entering.width + 'px',
                // height:   entering.height + 'px', maxHeight: entering.height + 'px', minHeight: entering.height + 'px',
            };
            Object.assign(parentElement.style, parentTempStyles);
            Object.assign(exitingElement.style, exitingTempStyles);
            Object.assign(enteringElement.style, enteringTempStyles);
            interval_id = setInterval(() => {
                let decimal                = 10 * i++ / timeout;
                let percent                = 100 * decimal;
                exitingElement.style.top   = `${2 * percent}%`;
                enteringElement.style.top  = `${100 - percent}%`;
                parentElement.style.height = `${exiting.height - decimal * parentHeightDifference}px`;
            }, 10);
            setTimeout(() => {
                resolve();
                Object.assign(exitingElement.style, originalInactiveStyle);
                Object.assign(enteringElement.style, originalActiveStyle);
                Object.assign(parentElement.style, originalParentElementStyle);
                clearInterval(interval_id);
            }, timeout)
        });
    }
}
const handleModelSceneActivationAttempt   = getActivationAnimationPromise(true);
const handleModelSceneDeactivationAttempt = getActivationAnimationPromise(false);

export class InactiveDevComponent extends React.Component {
    static propTypes = {
        activeElRef: PropTypes.func,
        title:       PropTypes.string,
        className:   PropTypes.string
    };
    
    render() {
        let className = this.props.className;
        return (
            <div ref={this.props.activeElRef} className={`dev--component ${className} collapsed`}>
                <h2 className={`title ${className}--title`}>{this.props.title}</h2>
            </div>
        )
    }
}

export class DevScene extends React.Component {
    render() {
        const matchActivationTarget              = (target) => {
            return target.classList.contains("title");
        };
        const {title, className, childClassName} = this.props;
        return (
            <div className={`scene--wrapper dev--scene--wrapper ${className}--scene--wrapper`}>
                <SelectivelyActive matchTarget={matchActivationTarget}
                                   handleActivationAttempt={handleModelSceneActivationAttempt}
                                   handleDeactivationAttempt={handleModelSceneDeactivationAttempt}
                                   className={`scene dev--scene ${className}--scene dev--component--wrapper`} isActive={false}>
                    {this.props.children}
                    <InactiveComponent component={InactiveDevComponent} title={title} className={childClassName} />
                </SelectivelyActive>
            </div>
        )
    }
}