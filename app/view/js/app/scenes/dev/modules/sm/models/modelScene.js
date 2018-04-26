import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import {SelectivelyActive} from "../../../components/selectivelyActive";
import {activateModel, closeModelCreateDialog, deactivateModel, executeModelQuery, fetchModels, openModelCreateDialog, toggleModelActivity, toggleModelPropertyActivity} from "./actions";
import {selectActiveModelMetas, selectActiveModelSmIDs, selectCreatingModelMetaSmIDs, selectModelDevInterface} from "./selector";
import {ActiveComponent, InactiveComponent} from "../../../components/selectivelyActive/components";
import {InactiveModelScene} from "./components/scene/inactive";
import {ActiveModelScene} from "./components/scene/active";

const handleModelSceneDeactivationAttempt = els => {
    const {active, inactive} = els;
    return new Promise(resolve => {
        let timeout                                                                                    = 250;
        let i                                                                                          = 0, interval_id;
        let {...originalActiveStyle}                                                                   = active.style;
        let {...originalInactiveStyle}                                                                 = inactive.style;
        const {top: activeTop, left: activeLeft, bottom: activeBottom, right: activeRight}             = active.getBoundingClientRect();
        const {top: inactive_top, left: inactive_left, bottom: inactive_bottom, right: inactive_right} = inactive.getBoundingClientRect();
        
        let parentHeightStyle = active.parentElement.style.height;
        let activeElHeight    = activeBottom - activeTop;
        console.log(activeElHeight);
        active.parentElement.style.height   = `${activeElHeight}px`;
        active.parentElement.style.position = "relative";
        active.style.position               = "relative";
        active.style.left                   = 0 + 'px';
        active.style.top                    = 0 + 'px';
        let actualActiveWidth               = activeRight - activeLeft;
        let actualInactiveWidth             = inactive_right - inactive_left;
        active.style.width                  = (actualActiveWidth) + 'px';
        active.style.maxWidth               = (actualActiveWidth) + 'px';
        active.style.minWidth               = (actualActiveWidth) + 'px';
        active.style.height                 = (activeElHeight) + 'px';
        active.style.maxHeight              = (activeElHeight) + 'px';
        active.style.minHeight              = (activeElHeight) + 'px';
        inactive.style.position             = "absolute";
        inactive.style.top                  = "100%";
        inactive.style.zIndex               = 2;
        interval_id                         = setInterval(() => {
            let fracOfOne      = (10 * i++ / timeout);
            fracOfOne          = 100 * fracOfOne;
            active.style.top   = `${2 * fracOfOne}%`;
            inactive.style.top = `${100 - fracOfOne}%`;
        }, 10);
        setTimeout(() => {
            resolve();
            Object.assign(active.style, originalActiveStyle);
            Object.assign(inactive.style, originalInactiveStyle);
            active.parentElement.style.height = parentHeightStyle;
            clearInterval(interval_id);
        }, timeout)
    });
};

@connect(mapState, mapDispatch)
class ModelScene extends Component {
    constructor(props) {super(props);}
    
    componentDidMount() {this.props.fetchModels();}
    
    static matchActivationTarget(target) {
        return (
            target.classList.contains("model--metas") ||
            target.classList.contains("model--meta") ||
            target.classList.contains("model--container--title") ||
            target.classList.contains("model--container")
        );
    };
    
    render() {
        return (
            <div className="model--scene--wrapper">
                <SelectivelyActive matchTarget={ModelScene.matchActivationTarget}
                                   handleDeactivationAttempt={handleModelSceneDeactivationAttempt}
                                   className={"model--container--wrapper"}
                                   isActive={false}>
                    <ActiveComponent component={ActiveModelScene} {...this.props} />
                    <InactiveComponent component={InactiveModelScene} />
                </SelectivelyActive>
            </div>
        );
    }
}

export default ModelScene;
function mapState(state) {
    const modelState             = selectModelDevInterface(state);
    const models                 = selectActiveModelMetas(state) || {};
    const activeModelSmIDs       = selectActiveModelSmIDs(state) || [];
    const creatingModelMetaSmIDs = selectCreatingModelMetaSmIDs(state) || [];
    const allModelSmIDs          = modelState.list || [];
    return {
        models,
        allModelSmIDs,
        activeModelSmIDs,
        creatingModelMetaSmIDs
    };
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  toggleModelPropertyActivity,
                                  toggleModelActivity,
                                  activateModel,
                                  deactivateModel,
                                  fetchModels,
                                  openModelCreateDialog,
                                  closeModelCreateDialog,
                                  executeModelQuery
                              }, dispatch);
}