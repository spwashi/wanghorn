import React from "react"
import * as PropTypes from "prop-types"
import {ContentSection, ContentSectionLink, PageContent} from "../../components/page";
import {Link} from "base-components/navigation/components/link";
import {DEV__PATH} from "../dev/paths";

const pageClassName = 'about-me';

const InlineDisplayContainer = ({children}) => {
    return (
        <div className={`inline-display--container`}>
            {children}
        </div>
    );
};
const DisplayItem            = ({children, title, caption}) => {
    return (
        <div className="wrapper display--item--wrapper">
            <figure className="display--item">
                {children}
                <div className="display--item--title">{title}</div>
                <figcaption className="caption display--item--caption">{caption}</figcaption>
            </figure>
        </div>
    )
};
DisplayItem.propTypes        = {
    children: PropTypes.oneOfType([PropTypes.element]),
    title:    PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    caption:  PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};
const InlineDisplayDummy     = () =>
    <InlineDisplayContainer>
        <DisplayItem title={'Thing1'}
                     caption={'Puts the stuff where you need it'}>Text-1</DisplayItem>
        <DisplayItem title={'Thing2'}
                     caption={'Puts the stuff where you need it'}>Text-2</DisplayItem>
        <DisplayItem title={'Thing3'}
                     caption={'Puts the stuff where you need it'}>Text-3</DisplayItem>
    </InlineDisplayContainer>;

export default class extends React.Component {
    componentDidMount() {
        const aScript = document.createElement('script');
        aScript.type  = 'text/javascript';
        aScript.src   = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js";
        document.head.appendChild(aScript);
        aScript.onload = function () {
            const all = document.querySelectorAll("pre code");
            all.forEach(function (block, i) {
                console.log(i);
                hljs.highlightBlock(block);
            });
        };
    }
    
    render() {
        return (
            <PageContent pageTitle="About Me" pageClass={`.page--__--${pageClassName}`}>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css" />
                <nav>
                    <ul>
                        <li><ContentSectionLink anchor="what-I-do">What I Do </ContentSectionLink></li>
                        <li><ContentSectionLink anchor="how-I-work">How I Work</ContentSectionLink></li>
                        <li><ContentSectionLink anchor="to-do">Sam's todo list</ContentSectionLink></li>
                    </ul>
                </nav>
                <ContentSection name={'what-I-do'}>
                    <h2>What I Do</h2>
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
                </ContentSection>
                <ContentSection name={'how-I-work'}>
                    <h2>How I work</h2>
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
                                <a href={"https://github.com/spwashi/SmPHP"} title={"The framework of my backend"}>SmPHP.</a>
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
                </ContentSection>
                <ContentSection name={'to-do'}>
                    <h2>To Do:</h2>
                    <ul>
                        <li>
                            Documentation
                            <ul>
                                <li>The <Link to={DEV__PATH}>Dev Interface</Link> has no way to describe properties</li>
                                <li><ContentSectionLink anchor="how-I-work">"How I Work" Section</ContentSectionLink> could be improved.</li>
                            </ul>
                        </li>
                        
                        <li>
                            Styling
                            <ul>
                                <li>Not too big a fan of the nav links at the top of this page's content. They could be buttons?</li>
                                <li>There's a formatting error in the Documentation tab of this list!</li>
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
                </ContentSection>
            </PageContent>
        );
    }
}