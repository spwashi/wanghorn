import React from "react"
import * as PropTypes from "prop-types"
import SmID_LinkContainer from "../../../../../../sm/components/meta/nav";
import ContentSection, {ContentSectionHeader} from "../../../../../../../components/page/content/section";
import {EntityContainerDescription} from "./components";
import {Route} from "react-router-dom"
import {getURI} from "../../../../../../../../path/resolution";
import EntityMeta from "../entityMeta/index";
import {getNameFromSmID} from "../../../utility";
import {DEV} from "../../../../../../../../path/paths";
import {LinkItem} from "../../../../../../../../components/navigation";

class ActiveEntityScene extends React.Component {
    static propTypes    = {
        entities:                     PropTypes.object,
        allEntitySmIDs:               PropTypes.array,
        toggleEntityPropertyActivity: PropTypes.func,
        toggleEntityActivity:         PropTypes.func,
        activateEntity:               PropTypes.func,
        deactivateEntity:             PropTypes.func,
        fetchEntities:                PropTypes.func,
        openEntityCreateDialog:       PropTypes.func,
        closeEntityCreateDialog:      PropTypes.func,
        executeEntityQuery:           PropTypes.func,
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    
    render() {
        const {executeEntityQuery, toggleEntityPropertyActivity} = this.props;
        const {allEntitySmIDs, entities, activeSmID}             = this.props;
        const {activeElRef}                                      = this.props;
        
        const header =
                  <LinkItem to={DEV} isButton={true}>
                      <ContentSectionHeader title="Entities" className={'dev--scene--toggle'} />
                  </LinkItem>;
        
        const onTogglePropertyClick = propertySmID => toggleEntityPropertyActivity({smID: propertySmID});
        const getSmID_LinkURI       = smID => getURI('dev--entity', {name: getNameFromSmID(smID)});
        
        return (
            <ContentSection sectionRef={activeElRef} className={"dev--component smEntity--container"} header={header}>
                <EntityContainerDescription />
                <SmID_LinkContainer ownerType={'entity'} allSmIDs={allEntitySmIDs} getSmID_LinkURI={getSmID_LinkURI} activeSmID={activeSmID} />
                <Route path={getURI('dev--entity', null, {skipEmpty: true, asReactRoute: true})}
                       component={({match}) => {
                           const entityName = match.params.name;
                           const smID       = '[Entity]' + entityName;
                           const entityMeta = entities[smID] || {};
                           return <EntityMeta key={smID}
                                              {...entityMeta}
                                              smID={smID}
                                              onTogglePropertyClick={onTogglePropertyClick}
                                              executeEntityQuery={executeEntityQuery} />;
                       }} />
            </ContentSection>
        );
    }
}

export default ActiveEntityScene;