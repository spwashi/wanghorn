import React from "react"
import * as PropTypes from "prop-types"

class AttrValue extends React.Component {
    render() {
        let inner;
        const value = this.props.value;
        const attr  = this.props.attr;
        if (attr === "smID") {
            const smID__id = value.replace(' ', '');
            inner          = <a id={smID__id} href={`#${smID__id}`}>{value}</a>
        } else if (typeof value === "string" || typeof value === "number") {
            inner = value;
        } else {
            inner =
                <pre>
                    {Array.isArray(value) ? value.map((item, i) => <div key={i} className={`array--item__${i}`}>{item}</div>) : JSON.stringify(value, ' ', 3)}
                </pre>;
        }
        return inner;
    }
}

export default AttrValue;
AttrValue.propTypes = {
    attr:  PropTypes.string,
    value: PropTypes.any
};