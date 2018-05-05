import React from "react"
import {withRouter} from "react-router"
import {ContentSection, ContentSectionLink, PageContent} from "../../components/page";
import {Link} from "base-components/navigation/components/link";
import {DEV__PATH} from "../dev/paths";
import Stateful from "../dev/components/stateful/stateful";
import State from "../dev/components/stateful/state";
import {ContentSectionHeader} from "../../components/page/content/section";
import {getURI} from "../../../path/resolution";

const pageClassName = 'about-me';
let WhatIDo         = function () {
    return (
        <ContentSection name={'what-I-do'} header={<ContentSectionHeader title={"What I Do"} />}>
            <ContentSection>
                <h3>I'm a code library!</h3>
                <p>
                    I stub out some common structures and features of web applications to help Sam
                    <a href={"https://youtrack.spwashi.com"}> rapidly prototype and develop websites</a>.
                </p>
                <ul>
                    <li>
                        Front-end
                        <ul>
                            <li>React/Redux</li>
                            <li>
                                <a href={"https://github.com/spwashi/wanghorn/blob/local/app/tasks/gulpfile.babel.js"}>Gulp</a> / <a href={"https://github.com/spwashi/wanghorn/blob/local/app/tasks/webpack.config.babel.js"}>Webpack</a>
                            </li>
                            <li>Git workflow</li>
                        </ul>
                    </li>
                    <li>
                        Back-end
                        <ul>
                            <li>
                                <a href="https://github.com/spwashi/SmPHP">Custom PHP 7.1 Framework</a>
                                <ul>
                                    <li><a href={"https://github.com/spwashi/SmPHP/tree/master/src/Sm/Controller"}>Controller Layer</a></li>
                                    <li>
                                        <a href={"https://github.com/spwashi/SmPHP/tree/master/src/Sm/Representation"}>Representation Layer</a>
                                        <ul>
                                            <li><a href={"https://github.com/spwashi/SmPHP/tree/master/src/Modules/View/Twig"}>Twig View Module</a></li>
                                            <li><a href={"https://github.com/spwashi/SmPHP/tree/master/src/Modules/View/PlainFile"}>Plain File View Module</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href={"https://github.com/spwashi/SmPHP/tree/master/src/Sm/Query"}>Query Layer</a>
                                        <ul>
                                            <li><a href="https://github.com/spwashi/SmPHP/tree/master/src/Modules/Query/MySql">MySQL Query Module</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href={"https://github.com/spwashi/SmPHP/tree/master/src/Sm/Communication"}>Communication Layer</a>
                                        <ul>
                                            <li><a href={"https://github.com/spwashi/SmPHP/tree/master/src/Sm/Communication/Routing"}>Router</a></li>
                                            <li>
                                                <a href="https://github.com/spwashi/SmPHP/tree/master/src/Modules/Network/Http">HTTP Module</a>
                                                <ul>
                                                    <li>HTTP Requests</li>
                                                    <li>HTTP Responses</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li><a href="https://github.com/spwashi/SmJS">Configuration Library</a></li>
                            <li>Git workflow (local, dev, prod branches)</li>
                        </ul>
                    </li>
                </ul>
            </ContentSection>
        </ContentSection>);
};
let HowIWork        = function () {
    return (
        <ContentSection name={'how-I-work'} header={<ContentSectionHeader title={"How I Work"} />}>
            <h3><ContentSectionLink anchor="to-do">To Do! </ContentSectionLink></h3>
            <p>{'Sam needs to work on documenting my code better. '}</p>
            <p>Here's the basic process:</p>
            <div className="goal--wrapper">
                <h4 className="label goal--label">Our goal</h4>
                <div className="item goal">We want to quickly and easily create a new PHP 7.1 Application with a React/Redux frontend</div>
            </div>
            <div className="goal-completion--process--wrapper">
                <h4 className="label goal-completion--process--label">How we reach it</h4>
                <ol className="item goal-completion--process">
                    <li>
                        Sam <a href="https://git-scm.com/docs/git-clone">clones</a> <a href={'https://github.com/spwashi/wanghorn'}>my source code</a> into his project's directory,
                        <pre><code className={'bash'}>git clone https://github.com/spwashi/wanghorn /var/www/new-site</code></pre>
                    </li>
                    <li>
                        He configures the application using a <a href={"https://github.com/spwashi/SmJS"} title={"The library that configures me"}>JavaScript library </a>
                        to create <a href={"https://github.com/spwashi/wanghorn/tree/local/app/config/out"}>.json files</a> which will be interpreted by <a href={"https://github.com/spwashi/wanghorn"} title={"My back-end code"}>my back-end </a> via
                        <a href={"https://github.com/spwashi/SmPHP"} title={"The framework of my backend"}> SmPHP.</a>
                        <ul>
                            <li><a href="https://github.com/spwashi/wanghorn/blob/local/app/config/index.js">General Configuration</a></li>
                            <li><a href="https://github.com/spwashi/wanghorn/blob/local/app/config/pre/routes/routes.js">Route Configuration</a></li>
                            <li><a href="https://github.com/spwashi/wanghorn/blob/local/app/config/pre/models/models.js">Model Configuration</a></li>
                        </ul>
                    </li>
                    <li>
                        Sam initializes the application using
                        <pre><code className={'bash'}>cd /var/www/new-site/app && npm run init</code></pre>
                        Which installs packages from <a href="https://getcomposer.org/">composer</a> and
                        <a href="https://www.npmjs.com/">NPM</a>, and pulls updated libraries from <a href="https://github.com/spwashi">github</a>
                    </li>
                    <li>You can access the site <a href={"https://www.cyberciti.biz/faq/howto-find-unix-linux-apache-documentroot/"}>(assuming standard hosting locations)</a></li>
                </ol>
            </div>
        </ContentSection>);
};
let ToDo            = function () {
    return <ContentSection name={'to-do'} header={<ContentSectionHeader title={"To Do"} />}>
        <ul>
            <li>
                Documentation
                <ul>
                    <li>The <Link to={DEV__PATH}>Dev Interface</Link> needs to describe <a href={getURI("dev--entities")}>Entities</a></li>
                    <li><a href="#how-I-work">"How I Work" Section</a> could be improved.</li>
                </ul>
            </li>
            
            <li>
                Styling
                <ul>
                    <li>Mobile responsiveness and retina-displays</li>
                </ul>
            </li>
            <li>
                Enhancements
                <ul>
                    <li>
                        Accessibility
                        <ul>
                            <li>
                                URL Friendliness
                                <ul>
                                    <li>The <Link to={DEV__PATH}>Dev Interface</Link> (update URL for active Models and Properties?)</li>
                                </ul>
                            </li>
                            <li><a href={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA"}>ARIA</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
        
        </ul>
    </ContentSection>;
};

class AboutMeScene extends React.Component {
    componentDidMount() {
        const aScript = document.createElement('script');
        aScript.type  = 'text/javascript';
        aScript.src   = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js";
        document.head.appendChild(aScript);
        aScript.onload = function () {
            const all = document.querySelectorAll("pre code");
            all.forEach(function (block, i) {
                hljs.highlightBlock(block);
            });
        };
    }
    
    render() {
        const onRequestFollow = (anchor) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(), 1000)
            })
        };
        let WHAT_I_DO__NAME   = "what-I-do";
        let HOW_I_WORK__NAME  = "how-I-work";
        let TO_DO__NAME       = "to-do";
        let activeAnchor      = (this.props.location.hash || '').replace('#', '') || WHAT_I_DO__NAME;
        let linkProps         = {doScroll: false, onRequestFollow};
        return (
            <PageContent pageTitle="About Me" pageClass={`.page--__--${pageClassName}`}>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css" />
                <nav>
                    <ul>
                        <li><ContentSectionLink {...linkProps} isActive={activeAnchor === WHAT_I_DO__NAME} anchor={WHAT_I_DO__NAME}>What I Do </ContentSectionLink></li>
                        <li><ContentSectionLink {...linkProps} isActive={activeAnchor === HOW_I_WORK__NAME} anchor={HOW_I_WORK__NAME}>How I Work</ContentSectionLink></li>
                        <li><ContentSectionLink {...linkProps} isActive={activeAnchor === TO_DO__NAME} anchor={TO_DO__NAME}>Sam's todo list</ContentSectionLink></li>
                    </ul>
                </nav>
                <Stateful activeStates={activeAnchor}>
                    <State name={WHAT_I_DO__NAME}><WhatIDo /></State>
                    <State name={HOW_I_WORK__NAME}><HowIWork /></State>
                    <State name={TO_DO__NAME}><ToDo /></State>
                </Stateful>
            </PageContent>
        );
    }
}

export default withRouter(AboutMeScene);