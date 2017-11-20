import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "../../../../../../../components/index";
import {connect} from "react-redux";
import * as IntegrationSchemeActions from '../../../IntegrationSchemeActions';
import schematic_depiction from "../../../../../index";

const EvaluationContainer     = ({isActive, evaluations, addEvaluation, onAddEvaluationClick}) => {
	if (!isActive) return null;

	const addEvaluationFn = () => {
		addEvaluation();
		onAddEvaluationClick && onAddEvaluationClick();
	};

	return (
		<div className="container--control--wrapper">
			<div className="container--control schema--attribute-integration-scheme--evaluation-list--control">
				<Button handleClick={addEvaluationFn} label="Add Evaluation"/>
			</div>
			<div className="evaluation-list schema--attribute-integration-scheme--evaluation-list">
				<ul className="container--items schema--attribute-integration-scheme--evaluation-list--items">
					{(evaluations || []).map((evaluation, index) => <li key={index}>{evaluation}</li>)}
				</ul>
			</div>
		</div>);
};
EvaluationContainer.propTypes = {
	isActive:      PropTypes.bool,
	evaluations:   PropTypes.array,
	addEvaluation: PropTypes.func
};
export default EvaluationContainer;

export const ActiveEvaluationContainer = connect(
	state => {
		const appState = state[schematic_depiction.constants.NAME] || {};
		console.log(appState);
		return {
			schemas: appState.schemas
		}
	},
	dispatch => {
		return {
			onAddEvaluationClick: () => {
				dispatch(IntegrationSchemeActions.createEvaluation())
			}
		}
	})(EvaluationContainer);


 