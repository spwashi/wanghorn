import React from "react"
import * as PropTypes from "prop-types"
import {withRouter} from "react-router"
import EntityConfigurationWrapper from "../../config/index";
import {EntitySceneLink} from "../../scene/sceneLink";
import {LinkItem} from "../../../../../../../../../components/navigation";

function getURI(name) {
    return "";
}
let EntityConfigurationContainer       = function ({onTogglePropertyClick, activeProperties, config, schematic, location}) {
    const jsConfigDescription  = <div>
        <a href={"https://github.com/spwashi/SmJS"}>SmJS (a.k.a Jessica) </a> is a configuration library used to configure the&nbsp;
        <EntitySceneLink title={'Entities'} /> I use to <em>store</em> data and the <LinkItem to={getURI('dev--entities')} wrapper={props => <span {...props} />}>Entities</LinkItem> you can
                                                                              use to <em>interact with</em> my data.</div>;
    const phpConfigDescription = <div>What <a href={"https://github.com/spwashi/SmPHP"}>SmPHP</a> uses to understand my entities.</div>;
    const ConfigWrapper        = ({schematic, type, description, isActive = false}) =>
        <EntityConfigurationWrapper type={type}
                                    isActive={isActive}
                                    onTogglePropertyClick={onTogglePropertyClick}
                                    description={description}
                                    activeProperties={activeProperties}
                                    schematic={schematic} />;
    const hash                 = (location.hash || '#').substr(1);
    return (
        [
            <ConfigWrapper key={'SmJS'} type={'SmJS'} description={jsConfigDescription} schematic={config} isActive={hash === 'SmJS'} />,
            <ConfigWrapper key={'SmPHP'} type={'SmPHP'} description={phpConfigDescription} schematic={schematic} isActive={hash === 'SmPHP'} />
        ]
    );
};
EntityConfigurationContainer           = withRouter(EntityConfigurationContainer);
EntityConfigurationContainer.propTypes = {
    onTogglePropertyClick: PropTypes.func,
    activeProperties:      PropTypes.array,
    config:                PropTypes.object,
    schematic:             PropTypes.object
};
export {EntityConfigurationContainer};