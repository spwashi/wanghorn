import React from "react";
import {Query} from "./components/query/index";
import {ModelConfigurationWrapper} from "./components/config/model";

export default ({
                    smID, config, model,
                    createTableStatement, alterTableStatements
                }) => {
    return (
        <div key={smID} className={"dev--model--wrapper"}>
            <h3 id={smID} className={"title model--smID"}>
                {smID}
            </h3>
            <div className="wrapper component--wrapper model--component--wrapper">
                <ModelConfigurationWrapper type={"Config"} model={config} />
                <ModelConfigurationWrapper model={model} />
            </div>
            <div className="wrapper component--wrapper model--component--wrapper">
                <Query query={createTableStatement} />
                {
                    (alterTableStatements || []).map(
                        (statement, key) => {
                            return <Query key={key} type="AlterTable" query={statement} />;
                        }
                    )
                }
            </div>
        </div>
    );
};