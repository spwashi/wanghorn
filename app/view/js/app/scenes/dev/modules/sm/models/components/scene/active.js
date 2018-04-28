import React from "react"
import * as PropTypes from "prop-types"
import bind from "bind-decorator";
import ModelMeta from "../../modelMeta";
import ModelLinkContainer from "../nav";
import {ModelContainerDescription} from "./components";
import ContentSection from "../../../../../../../components/page/content/section";

export class ActiveModelScene extends React.Component {
    static propTypes = {
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
              openModelCreateDialog       = this.props.openModelCreateDialog,
              closeModelCreateDialog      = this.props.closeModelCreateDialog,
              activeModelSmIDs            = this.props.activeModelSmIDs,
              creatingModelMetaSmIDs      = this.props.creatingModelMetaSmIDs,
              allModelSmIDs               = this.props.allModelSmIDs;
        
        const {activeElRef}       = this.props;
        let onTogglePropertyClick = propertySmID => {
            return toggleModelPropertyActivity({smID: propertySmID});
        };
        return (
            <ContentSection sectionRef={activeElRef} className={"dev--component model--container"}>
                <h2 className={"title model--container--title"}>Models</h2>
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
            </ContentSection>
        );
    }
}