import React from "react"
import * as PropTypes from "prop-types"
import {CONTROL__SELECT_MULTIPLE} from "./constants";
import SelectMultipleFilter from "./filter/selectMultipleFilter";
import {convertItemTagToTagID} from "../../selector";

class ControlComponent extends React.Component {
    render() {
        const {
                  controlType,
                  name,
                  onControlEvent,
                  title,
                  items: tags
              } = this.props;
        
        const on_ctrl_event    = onControlEvent || (() => {});
        const emitControlEvent = (eventName, ...args) => on_ctrl_event(name, controlType, eventName, ...args);
        let activeItemIDs      = this.props.activeItemIDs;
        let activeItems        = tags.filter(item => {
            let tagID = convertItemTagToTagID(item);
            return activeItemIDs.indexOf(tagID) > -1
        });
        
        switch (controlType) {
            case CONTROL__SELECT_MULTIPLE:
                return (
                    <div className={"control_component"}>
                        <div className="title control_component--title">{title}</div>
                        <SelectMultipleFilter categories={tags}
                                              activeItems={activeItems}
                                              onActivateItem={name => emitControlEvent('ACTIVATE', name)}
                                              onDeactivateItem={name => emitControlEvent('DEACTIVATE', name)} />
                    </div>
                )
        }
    }
}

export default ControlComponent;
ControlComponent.propTypes = {
    onControlEvent: PropTypes.func,
    
    title:         PropTypes.string,
    name:          PropTypes.string.isRequired,
    items:         PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
    activeItemIDs: PropTypes.arrayOf(PropTypes.string),
    
    controlType: PropTypes.oneOf([CONTROL__SELECT_MULTIPLE]).isRequired
};