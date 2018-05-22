import React from "react"
import * as PropTypes from "prop-types"
import {withRouter} from "react-router"
import ModelConfigurationWrapper from "../../config/model/config/config";
import {ModelSceneLink} from "../../scene/sceneLink";
import {LinkItem} from "../../../../../../../../../components/navigation";

function getURI(name) {
    return "";
}
let ModelConfigurationContainer       = function ({onTogglePropertyClick, activeProperties, config, model, location}) {
    const jsConfigDescription  = <div>
        <a href={"https://github.com/spwashi/SmJS"}>SmJS (a.k.a Jessica) </a> is a configuration library used to configure the&nbsp;
        <ModelSceneLink title={'Models'} /> I use to <em>store</em> data and the <LinkItem to={getURI('dev--entities')} wrapper={props => <span {...props} />}>Entities</LinkItem> you can
                                                                              use to <em>interact with</em> my data.</div>;
    const phpConfigDescription = <div>What <a href={"https://github.com/spwashi/SmPHP"}>SmPHP</a> uses to understand my models.</div>;
    const ConfigWrapper        = ({model, type, description, isActive = false}) =>
        <ModelConfigurationWrapper type={type}
                                   isActive={isActive}
                                   onTogglePropertyClick={onTogglePropertyClick}
                                   description={description}
                                   activeProperties={activeProperties}
                                   model={model} />;
    const hash                 = (location.hash || '#').substr(1);
    return (
        [
            <ConfigWrapper key={'SmJS'} type={'SmJS'} description={jsConfigDescription} model={config} isActive={hash === 'SmJS'} />,
            <ConfigWrapper key={'SmPHP'} type={'SmPHP'} description={phpConfigDescription} model={model} isActive={hash === 'SmPHP'} />
        ]
    );
};
ModelConfigurationContainer           = withRouter(ModelConfigurationContainer);
ModelConfigurationContainer.propTypes = {
    onTogglePropertyClick: PropTypes.func,
    activeProperties:      PropTypes.array,
    config:                PropTypes.object,
    model:                 PropTypes.object
};
export {ModelConfigurationContainer};