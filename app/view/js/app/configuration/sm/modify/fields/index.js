import React from "react"
import SchematicField from "../../../../scenes/sm/components/form/creation/components/field/schematic";
import {PasswordField} from "./password";
import {PropertyReferenceField} from "./reference";
import {FileUploadField} from "./file";

SchematicField.fieldFactory.pushResolver([
                                             ({schematic}) => schematic && schematic.reference ? PropertyReferenceField : null,
                                             ({primaryDatatype}) => primaryDatatype === 'file' ? FileUploadField : null,
                                             ({primaryDatatype}) => primaryDatatype === 'password' ? PasswordField : null
                                         ]);