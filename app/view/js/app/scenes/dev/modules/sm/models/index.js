import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import bind from "bind-decorator";
import {SelectivelyActive} from "../../../components/selectivelyActive";
import ModelMeta from "./modelMeta";
import ModelLinkContainer from "./components/nav";
import {activateModel, deactivateModel, executeModelQuery, fetchModels, toggleModelActivity, toggleModelPropertyActivity} from "./actions";
import {selectActiveModelMetas, selectActiveModelSmIDs, selectModelDevInterface} from "./selector";
import ContentSection from "../../../../../components/page/content/section";
import {ActiveComponent, InactiveComponent} from "../../../components/selectivelyActive/components";
import {MODELS} from "../../../paths";

let modelContainerDescription =
        <div className="description model--container--description">
            <SelectivelyActive className={'purpose--wrapper'} matchTarget={target => target.classList.contains("purpose--title")}>
                <InactiveComponent component={() => <h3 className={"purpose--title"}>Purpose</h3>} />
                <ActiveComponent component={() => {
                    return (
                        <div className="purpose">
                            <h3 className={"purpose--title"}>Purpose</h3>
                            <h4>Describe the structure and status of:</h4>
                            <ol>
                                <li>
                                    <a href={`${MODELS}?models`}>This application's data structures</a>
                                    <ul>[ used by... ]
                                        <li>
                                            <em>The <a href="https://github.com/spwashi/SmJS" title={"The Configuration Library this app uses mainly"}>configuration library</a></em> that helps me get set up <sub>(written in ECMAScript 2015+)</sub>
                                        </li>
                                        <li><em>The <a href="https://github.com/spwashi/SmPHP" title={"The PHP Framework this app is built on"}>PHP 7.1 framework </a></em>
                                            that drives my data storage and mutation
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href={"https://dev.mysql.com/doc/refman/5.7/en/create-table.html"}>CREATE TABLE </a>and
                                    <a href={"https://dev.mysql.com/doc/refman/5.7/en/alter-table.html"}> ALTER TABLE </a>
                                    {"statements which could be used to establish the MySQL tables that hold the Model's data"}
                                </li>
                            </ol>
                        </div>
                    )
                }} />
            </SelectivelyActive>
        </div>;

class ActiveModelScene extends React.Component {
    @bind
    handleModelLinkTrigger(event) {
        const smID = event.target.dataset.sm_id;
        event.preventDefault();
        this.props.toggleModelActivity({smID});
    }
    
    render() {
        const {toggleModelPropertyActivity, executeModelQuery, models, activeModelSmIDs, allModelSmIDs} = this.props;
        const {activeElRef}                                                                             = this.props;
        let onTogglePropertyClick                                                                       = propertySmID => {
            return toggleModelPropertyActivity({smID: propertySmID});
        };
        return (
            <ContentSection sectionRef={activeElRef} className={"model--container"}>
                <h2 className={"model--container--title"}>Models</h2>
                {modelContainerDescription}
                <ModelLinkContainer onItemTrigger={this.handleModelLinkTrigger}
                                    activeSmIDs={activeModelSmIDs}
                                    allSmIDs={allModelSmIDs} />
                {
                    Object.entries(models)
                          .map(([smID, modelState]) => {
                              let modelMetaProps = {...modelState, smID, onTogglePropertyClick, executeModelQuery};
                              return <ModelMeta key={smID} {...modelMetaProps} />;
                          })
                }
            </ContentSection>
        );
    }
}

class InactiveModelScene extends React.Component {
    render() {
        return <div ref={this.props.activeElRef} className={"model--container collapsed"}>
            <h2 className="title model--container--title">Models</h2>
        </div>
    }
}

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
        let handleDeactivationAttempt = els => {
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
        return (
            <div className="model--scene--wrapper">
                <SelectivelyActive matchTarget={ModelScene.matchActivationTarget}
                                   handleDeactivationAttempt={handleDeactivationAttempt}
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
    const modelState       = selectModelDevInterface(state);
    const models           = selectActiveModelMetas(state) || {};
    const activeModelSmIDs = selectActiveModelSmIDs(state) || [];
    const allModelSmIDs    = modelState.list || [];
    return {
        models,
        allModelSmIDs,
        activeModelSmIDs
    };
}
function mapDispatch(dispatch) {
    return bindActionCreators({
                                  toggleModelPropertyActivity,
                                  toggleModelActivity,
                                  activateModel,
                                  deactivateModel,
                                  fetchModels,
                                  executeModelQuery
                              }, dispatch);
}