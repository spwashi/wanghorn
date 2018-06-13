import React                    from "react"
import SchematicField           from "../../../../scenes/sm/components/modification/components/field/schematic";
import {PasswordField}          from "./password";
import {PropertyReferenceField} from "./reference";
import {FileUploadField}        from "./file";
import {DatetimeField}          from "./datetime";
import {SlugField}              from "./slug";

const fieldIsSlug = ({primaryDatatype, schematic}) => primaryDatatype === 'slug' || (schematic && schematic.datatypes && schematic.datatypes.indexOf('slug') > 0);
SchematicField.fieldFactory.pushResolver([
	                                         ({schematic}) => schematic && schematic.reference ? PropertyReferenceField : null,
	                                         ({primaryDatatype}) => primaryDatatype === 'datetime' ? DatetimeField : null,
	                                         ({primaryDatatype}) => primaryDatatype === 'file' ? FileUploadField : null,
	                                         ({primaryDatatype}) => primaryDatatype === 'password' ? PasswordField : null,
	                                         field => fieldIsSlug(field) ? SlugField : null
                                         ]);