import React from "react"
import * as PropTypes from "prop-types"

export default class SelectMultipleFilter extends React.Component {
    render() {
        const categories  = (this.props.categories || []).reduce((all, tag) => {
                                                                     const {name: name} = tag;
                                                                     if (all.indexes.indexOf(name) > -1) return all;
                                                                     all.indexes.push(name);
                                                                     all.tags.push(tag);
                                                                     return all;
                                                                 },
                                                                 {tags: [], indexes: []}).tags;
        const activeItems = this.props.activeItems;
        return (
            <ul className="filter--manager filter--manager__select-multiple">
                {
                    categories.map(categoryTag => {
                        const {text, name}   = categoryTag;
                        const cat            = text;
                        const cat_identifier = `category--${name}`;
                        const onChange       = (event: Event) => {
                            const isActive = event.target.checked;
                            isActive ? this.props.onActivateItem(name) : this.props.onDeactivateItem(name)
                        };
                        return (
                            <li key={cat || name} className="filter_category--wrapper">
                                <label>
                                    <input onChange={onChange} type="checkbox" name={`${cat_identifier}`} checked={activeItems.indexOf(categoryTag) > -1} />
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
    categories:       PropTypes.arrayOf(PropTypes.shape({
                                                            text: PropTypes.string,
                                                            name: PropTypes.string
                                                        })),
    activeItems:      PropTypes.arrayOf(PropTypes.shape({
                                                            text: PropTypes.string,
                                                            name: PropTypes.string
                                                        })),
    onActivateItem:   PropTypes.func,
    onDeactivateItem: PropTypes.func
};