import React from "react"
import * as PropTypes from "prop-types"

export default class SelectMultipleFilter extends React.Component {
    render() {
        const {categories} = this.props;
        
        return (
            <ul className="filter--manager filter--manager__select-multiple">
                {
                    categories.map(cats => {
                        const {text, name}   = cats;
                        const cat            = text;
                        const cat_identifier = `category--${name}`;
                        return (
                            <li key={cat || name} className="filter_category--wrapper">
                                <label>
                                    <input onChange={event => alert("Will implement soon!")} type="checkbox" name={`${cat_identifier}`} />
                                    <div className="category--name">{cat}</div>
                                </label>
                            </li>
                        );
                    })
                }
            </ul>
        )
    }
}

SelectMultipleFilter.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
                                                      text: PropTypes.string,
                                                      name: PropTypes.string
                                                  }))
};