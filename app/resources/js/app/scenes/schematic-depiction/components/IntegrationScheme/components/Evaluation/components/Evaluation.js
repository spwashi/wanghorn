import React, {Component} from "react";
import PropTypes from "prop-types";
import EvaluationArgument from "./EvaluationArgument";

const Evaluation = ({instantial, essential}) => {
    return (
        <div className="evaluation schema--attribute-integration-scheme--evaluation">
            <EvaluationArgument anchorID={instantial} type="instantial" />
            <EvaluationArgument anchorID={essential} type="essential" />
        </div>
    );
    
};

Evaluation.propTypes = {
    instantial: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    essential:  PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Evaluation;