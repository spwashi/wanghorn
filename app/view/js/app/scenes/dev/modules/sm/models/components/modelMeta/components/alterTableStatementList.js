import React from "react"
import * as PropTypes from "prop-types"
import {Query} from "../../query/index";

export const AlterTableStatementList = ({statements, executeQuery}) =>
    <div className="alter_table_statement--container alter_table_statement--list container list">
        {statements.map((statement, key) => <Query key={key}
                                                   executeQuery={executeQuery}
                                                   canExecute={true}
                                                   type="AlterTable"
                                                   query={statement} />)}
    </div>;

AlterTableStatementList.propTypes = {
    statements:   PropTypes.arrayOf(PropTypes.string),
    executeQuery: PropTypes.func
};