import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import Modal from "../../../../../../../components/modal";
import ModelMeta from "../../modelMeta";
import ModelLinkContainer from "../nav";
import ContentSection, {ContentSectionHeader} from "../../../../../../../components/page/content/section";
import {ModelContainerDescription} from "./components";
import {Route} from "react-router-dom"
import {getURI} from "../../../../../../../../path/resolution";
import {SmEntityCreationForm} from "../../../../../../sm/creation/components/form";
import {selectModelMetaHavingSmID_fromAllModelMetas} from "../../selector";

class CreateModelDialog extends React.Component {
    state = {isActive: true};
    
    render() {
        let {match, history, models} = this.props;
        const {params}               = match;
        const {smID}                 = params;
        let onRequestClose           = () => {
            let devURI = getURI('dev--home', null, {skipEmpty: true, asReactRoute: true});
            this.setState({isActive: false});
            return history.action === 'PUSH' ? history.goBack()
                                             : history.push(devURI);
        };
        const modelMeta              = selectModelMetaHavingSmID_fromAllModelMetas(models, smID);
        if (!modelMeta) return null;
        return (
            <Modal isOpen={this.state.isActive} onRequestClose={onRequestClose} title={`Create New ${smID}`} contentLabel="Create New">
                <SmEntityCreationForm config={modelMeta.config} url={getURI("dev--create_model--receive", {smID})} />
            </Modal>
        )
    };
};

class ActiveModelScene extends React.Component {
    static propTypes    = {
        models:                      PropTypes.object,
        creatingModelMetaSmIDs:      PropTypes.array,
        allModelSmIDs:               PropTypes.array,
        activeModelSmIDs:            PropTypes.array,
        //
        toggleModelPropertyActivity: PropTypes.func,
        toggleModelActivity:         PropTypes.func,
        activateModel:               PropTypes.func,
        deactivateModel:             PropTypes.func,
        fetchModels:                 PropTypes.func,
        openModelCreateDialog:       PropTypes.func,
        closeModelCreateDialog:      PropTypes.func,
        executeModelQuery:           PropTypes.func,
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    
    @bind
    handleModelLinkTrigger(smID) {
        if (this.props.activeModelSmIDs.indexOf(smID) > -1) {
        } else {
        
        }
        this.props.toggleModelActivity({smID});
    }
    
    render() {
        const toggleModelPropertyActivity = this.props.toggleModelPropertyActivity,
              executeModelQuery           = this.props.executeModelQuery,
              models                      = this.props.models,
              location                    = this.props.location;
        let urlActiveSmIDs                = this.getActiveSmIDsFromLocation(location, this.props.activeModelSmIDs);
        const openModelCreateDialog       = this.props.openModelCreateDialog,
              closeModelCreateDialog      = this.props.closeModelCreateDialog,
              activeModelSmIDs            = urlActiveSmIDs,
              creatingModelMetaSmIDs      = this.props.creatingModelMetaSmIDs,
              allModelSmIDs               = this.props.allModelSmIDs;
        const {activeElRef}               = this.props;
        const header                      = <ContentSectionHeader title="Models" className={'dev--scene--toggle'} />;
        let onTogglePropertyClick         = propertySmID => {
            return toggleModelPropertyActivity({smID: propertySmID});
        };
        return (
            <ContentSection sectionRef={activeElRef} className={"dev--component model--container"} header={header}>
                <ModelContainerDescription />
                <ModelLinkContainer onItemTrigger={this.handleModelLinkTrigger}
                                    activeSmIDs={activeModelSmIDs}
                                    allSmIDs={allModelSmIDs} />
                {
                    [...activeModelSmIDs]
                        .reverse()
                        .map(smID => {
                            const modelState   = models[smID] || {};
                            let modelMetaProps = {
                                ...modelState,
                                smID,
                                openModelCreateDialog,
                                closeModelCreateDialog,
                                onTogglePropertyClick,
                                isCreatingNew: creatingModelMetaSmIDs.indexOf(smID) > -1,
                                executeModelQuery
                            };
                            return <ModelMeta key={smID} {...modelMetaProps} />;
                        })
                }
                <Route path={getURI('dev--create_model', null, {skipEmpty: true, asReactRoute: true})}
                       component={props => <CreateModelDialog models={models} {...props} />} />
            </ContentSection>
        );
    }
    
    getActiveSmIDsFromLocation(location, prop_smIDs) {
        let modelSmID_regex    = /\[Model]\s?[_a-zA-Z]+/;
        const pathname_smIDs   = modelSmID_regex.exec(location.pathname) || [];
        const modelSmIDsInHash = modelSmID_regex.exec(location.hash) || [];
        let urlActiveSmIDs     = pathname_smIDs[0] ? [pathname_smIDs[0]] : [];
        urlActiveSmIDs         = [...urlActiveSmIDs, ...prop_smIDs];
        if (modelSmIDsInHash[0]) urlActiveSmIDs.push(modelSmIDsInHash[0]);
        urlActiveSmIDs = urlActiveSmIDs.filter(item => !!item);
        return [...new Set(urlActiveSmIDs)];
    }
}

export default ActiveModelScene;