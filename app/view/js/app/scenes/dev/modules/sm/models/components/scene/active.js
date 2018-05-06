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
import {SmEntityCreationForm} from "../creation/form";
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
                <SmEntityCreationForm config={modelMeta.config} smID={smID} />
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
    handleModelLinkTrigger(event) {
        const smID = event.target.dataset.sm_id;
        event.preventDefault();
        this.props.toggleModelActivity({smID});
    }
    
    render() {
        const toggleModelPropertyActivity = this.props.toggleModelPropertyActivity,
              executeModelQuery           = this.props.executeModelQuery,
              models                      = this.props.models,
              location                    = this.props.location;
        const modelSmIDsInLocation        = /\[Model]\s?[a-zA-Z]+/.exec(location.pathname) || [];
        const openModelCreateDialog       = this.props.openModelCreateDialog,
              closeModelCreateDialog      = this.props.closeModelCreateDialog,
              activeModelSmIDs            = modelSmIDsInLocation[0] ? [modelSmIDsInLocation[0]] : this.props.activeModelSmIDs,
              creatingModelMetaSmIDs      = this.props.creatingModelMetaSmIDs,
              allModelSmIDs               = this.props.allModelSmIDs;
        
        const {activeElRef}       = this.props;
        let onTogglePropertyClick = propertySmID => {
            return toggleModelPropertyActivity({smID: propertySmID});
        };
        return (
            <ContentSection sectionRef={activeElRef} className={"dev--component model--container"} header={<ContentSectionHeader title="Models" />}>
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
}

export default ActiveModelScene;