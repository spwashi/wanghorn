import React, {Component} from "react";

import IntegrationScheme from "../../IntegrationScheme";
import Perspective from "./../Perspective";
import AnchorPlaceholder from "../../Anchor/components/AnchorPlaceholder";

const ApplicationContainer = ({schemaID, integrationSchemeID}) => {
	return (
		<div className="schema--application-container">
			<AnchorPlaceholder anchorID={schemaID}/>
			<IntegrationScheme/>
		</div>
	)
};

const Schema = ({schemaID, integrationSchemeID}) => {
	return (
		<div className="schema--schema">
			<header>
				<Perspective/>
				<ApplicationContainer schemaID={schemaID}/>
			</header>
		</div>
	)
};
export default Schema;