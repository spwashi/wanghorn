import React from "react"
import * as PropTypes from "prop-types"

const StateComponent           = () =>
    class ActiveOrInactiveComponent extends React.Component {
        render() {
            let Child       = this.props.component;
            const childType = typeof Child;
            switch (childType) {
                case "function":
                    return <Child />;
                case "object":
                    return Child;
                default:
                    return null;
            }
        }
    };
export const ActiveComponent   = StateComponent();
export const InactiveComponent = StateComponent();

ActiveComponent.propTypes   = {component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])};
InactiveComponent.propTypes = {component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])};