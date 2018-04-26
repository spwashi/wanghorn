import React from "react"

import {MODELS} from "../../../../../paths";
import {SelectivelyActive} from "../../../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../../../components/selectivelyActive/components";

export let ModelContainerDescription = props =>
    <div className="description model--container--description">
        <SelectivelyActive className={'purpose--wrapper'} matchTarget={target => target.classList.contains("purpose--title")}>
            <InactiveComponent component={() => <h3 className={"purpose--title"}>What It Do??</h3>} />
            <ActiveComponent component={() => {
                return (
                    <div className="purpose">
                        <h3 className={"purpose--title"}>What it do:</h3>
                        <h4>Describe the structure and status of:</h4>
                        <ol>
                            <li>
                                <a href={`${MODELS}?models`}>This application's data structures</a>
                                <ul>[ used by... ]
                                    <li>
                                        <em>The <a href="https://github.com/spwashi/SmJS" title={"The Configuration Library this app uses mainly"}>configuration library</a></em> that helps me get set up <sub>(written in ECMAScript 2015+)</sub>
                                    </li>
                                    <li><em>The <a href="https://github.com/spwashi/SmPHP" title={"The PHP Framework this app is built on"}>PHP 7.1 framework </a></em>
                                        that drives my data storage and mutation
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href={"https://dev.mysql.com/doc/refman/5.7/en/create-table.html"}>CREATE TABLE </a>and
                                <a href={"https://dev.mysql.com/doc/refman/5.7/en/alter-table.html"}> ALTER TABLE </a>
                                {"statements which could be used to establish the MySQL tables that hold the Model's data"}
                            </li>
                        </ol>
                    </div>
                )
            }} />
        </SelectivelyActive>
    </div>;
