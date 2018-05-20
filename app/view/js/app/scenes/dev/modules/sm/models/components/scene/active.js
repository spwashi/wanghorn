import React from "react"
import * as PropTypes from "prop-types"
import SmID_LinkContainer from "../nav";
import ContentSection, {ContentSectionHeader} from "../../../../../../../components/page/content/section";
import {ModelContainerDescription} from "./components";
import {Route} from "react-router-dom"
import {getURI} from "../../../../../../../../path/resolution";
import ModelMeta from "../modelMeta/index";
import {getNameFromSmID} from "../../../utility";
import {DEV} from "../../../../../../../../path/paths";
import {LinkItem} from "../../../../../../../../components/navigation";

class ActiveModelScene extends React.Component {
    static propTypes    = {
        models:                      PropTypes.object,
        allModelSmIDs:               PropTypes.array,
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
    
    render() {
        const {executeModelQuery, toggleModelPropertyActivity} = this.props;
        const {allModelSmIDs, models, activeSmID}              = this.props;
        const {activeElRef}                                    = this.props;
        
        const header                =
                  <LinkItem to={DEV} isButton={true}>
                      <ContentSectionHeader title="Models" className={'dev--scene--toggle'} />
                  </LinkItem>;
        const onTogglePropertyClick = propertySmID => toggleModelPropertyActivity({smID: propertySmID});
        const getSmID_LinkURI       = smID => getURI('dev--model', {name: getNameFromSmID(smID)});
        return (
            <ContentSection sectionRef={activeElRef} className={"dev--component model--container"} header={header}>
                <ModelContainerDescription />
                <SmID_LinkContainer ownerType={'model'} allSmIDs={allModelSmIDs} getSmID_LinkURI={getSmID_LinkURI} activeSmID={activeSmID} />
                <Route path={getURI('dev--model', null, {skipEmpty: true, asReactRoute: true})}
                       component={({match}) => {
                           const modelName = match.params.name;
                           const smID      = '[Model]' + modelName;
                           const modelMeta = models[smID];
                           return <ModelMeta key={smID}
                                             {...modelMeta}
                                             smID={smID}
                                             onTogglePropertyClick={onTogglePropertyClick}
                                             executeModelQuery={executeModelQuery} />;
                       }} />
            </ContentSection>
        );
    }
}

export default ActiveModelScene;