import {connect} from "react-redux";
import React, {Component} from "react";
import Anchor from "./Anchor";
import schematic_depiction from "..";

export const AnchorContainer = ({schemas, onCreateAnchorClick}) => {
	schemas             = schemas || [];
	onCreateAnchorClick = onCreateAnchorClick || (() => {});
	return (
		<div>
			<button onClick={() => {onCreateAnchorClick()}}>Add Anchor</button>
			<div className="schema--container--items">
				{schemas.map(anchorID => <Anchor key={anchorID} schemaID={anchorID} />)}
			</div>
		</div>
	);
};

export default AnchorContainer

export const ActiveAnchorContainer = connect(
	state => {
		const appState = state[schematic_depiction.constants.NAME] || {};
		return {
			schemas: appState.schemas
		}
	},
	dispatch => {
		return {
			onCreateAnchorClick: () => {
				dispatch(schematic_depiction.actions.createAnchor())
			}
		}
	})(AnchorContainer);
