import React from "react";
import {Query} from "./components/query/index";
import {ModelConfigurationWrapper} from "./components/config/model";

export default ({
                    smID, config, model,
                    createTableStatement, alterTableStatements
                }) => {
    const jsConfigDescription  = <div>What <a href={"https://github.com/spwashi/SmJS"}>SmJS</a> uses to configure my models.</div>;
    const phpConfigDescription = <div>What <a href={"https://github.com/spwashi/SmPHP"}>SmPHP</a> uses to understand my models.</div>;
    return (
        <div key={smID} className={"dev--model--wrapper"}>
            <h3 id={smID} className={"title model--smID"}>
                {smID}
            </h3>
            <div className="wrapper component--wrapper model--component--wrapper">
                <ModelConfigurationWrapper description={jsConfigDescription} type={'SmJS'} model={config} />
                <ModelConfigurationWrapper description={phpConfigDescription} type={'SmPHP'} model={model} />
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