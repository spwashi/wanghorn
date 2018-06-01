import React from "react"
import * as PropTypes from "prop-types"
import ContentSection, {ContentSectionHeader} from "../../../../../../components/page/content/section";
import {ModelContainerDescription} from "./components";
import {Route} from "react-router-dom"
import {getReactPath, getURI} from "../../../../../../../path/resolution";
import ModelMeta from "../modelMeta/index";
import {getNameFromSmID} from "../../../../../sm/utility";
import {DEV} from "../../../../../../../path/paths";
import {LinkItem} from "../../../../../../../components/navigation";
import SmID_LinkContainer from "../../../../../sm/components/meta/nav";

class ActiveModelScene extends React.Component {
    static propTypes    = {
        models:                 PropTypes.object,
        allModelSmIDs:          PropTypes.array,
        openModelCreateDialog:  PropTypes.func,
        closeModelCreateDialog: PropTypes.func,
        executeModelQuery:      PropTypes.func,
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    
    render() {
        const {allModelSmIDs, models, activeSmID} = this.props;
        const {activeElRef}                       = this.props;
        
        const header          =
                  <LinkItem to={DEV} isButton={true}>
                      <ContentSectionHeader title="Models" className={'dev--scene--toggle'} />
                  </LinkItem>;
        const getSmID_LinkURI = smID => getURI('dev--model', {name: getNameFromSmID(smID)});
        return (
            <ContentSection sectionRef={activeElRef} className={"dev--component smEntity--container"} header={header}>
                <ModelContainerDescription />
                <SmID_LinkContainer ownerType={'model'}
                                    allSmIDs={allModelSmIDs}
                                    getSmEntityStatus={smID => models[smID] ? models[smID].status : null}
                                    getSmID_LinkURI={getSmID_LinkURI}
                                    activeSmID={activeSmID} />
                <Route path={getReactPath('dev--model')} component={({match}) => <ModelMeta smID={`[Model]${match.params.name}`} />} />
            </ContentSection>
        );
    }
}

export default ActiveModelScene;