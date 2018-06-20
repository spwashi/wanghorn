import React           from "react";
import {PropertyInput} from "../../../../scenes/sm/components/modification/components/field/propertyInput";
import {Field}         from "../../../../../components/form/field/field";

function convertToSlug(value) {
	return (value || '').replace(/[^a-zA-Z\d:]/g, '-')
	                    .replace(/-{2,}/, '-').toLowerCase();
}
export class SlugField extends React.Component {
	state = {hasBeenModified: false};
	componentDidMount() {
		const slug = this.getSlug();
		console.log('mounted', slug);
		if (slug && slug.length) {
			console.log(slug);
			this.props.setDefaultValue(slug);
		}
	}
	componentDidUpdate() {
		// !this.props.value && this.props.setDefaultValue && this.props.setDefaultValue(this.getSlug())
	}
	render() {
		const onValueChange         = this.props.onValueChange;
		const schematic             = this.props.schematic;
		const name                  = schematic.name;
		const title                 = this.props.title;
		const message               = this.props.message;
		const checkPropertyValidity = (schematic, password) => true;
		const onSlugValueChange     = value => {
			value = convertToSlug(value);
			if (value === '') {
				this.state.hasBeenModified && this.setState({hasBeenModified: false},
				                                            done => onValueChange(this.getSlug(), checkPropertyValidity))
			} else if (!this.state.hasBeenModified) {
				this.setState({hasBeenModified: true},
				              done => onValueChange(value, checkPropertyValidity));
			} else {
				onValueChange(value, checkPropertyValidity);
			}
		};

		const slug  = this.getSlug();
		const input = <PropertyInput title={title}
		                             value={slug}
		                             onValueChange={onSlugValueChange}
		                             schematic={schematic}/>;
		return <Field title={title}
		              name={name}
		              message={message}
		              input={input}/>;
	}
	getSlug() {
		const owner = this.props.owner;
		let slug    = this.props.value;

		if (!this.state.hasBeenModified && owner) {
			const titlePropertyValue = owner && owner.properties && owner.properties.title;
			slug                     = titlePropertyValue ? convertToSlug(titlePropertyValue) : '';
		}

		return slug;
	}
}