import React from "react"
import * as PropTypes from "prop-types"

export default class SelectMultipleFilter extends React.Component {
    render() {
        const {categories} = this.props;
        
        return (
            <ul className="filter__select-multiple">
                {
                    categories.map(cat => {
                        const cat_identifier = `category--${cat.toLowerCase()}`;
                        return (
                            <li key={cat} className="filter-category--wrapper">
                                <label>
                                    <input onChange={event=>alert("will implement soon!")} type="checkbox" name={`${cat_identifier}`} />
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
    categories: PropTypes.arrayOf(PropTypes.string)
};