import React from "react"
import * as PropTypes from "prop-types"
import {ContentSection, ContentSectionLink, PageContent} from "../../components/page";
import {Link} from "../../../components/navigation/components/link";
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
            console.log(all);
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
                            rapidly prototype and develop websites.
                        </p>
                        <ul>
                            <li>
                                Frontend
                                <ul>
                                    <li>ECMAScript 2015+ with Babel</li>
                                    <li>React/Redux</li>
                                    <li>Git workflow</li>
                                    <li>Gulp/Webpack</li>
                                </ul>
                            </li>
                            <li>
                                Backend
                                <ul>
                                    <li>PHP 7.1</li>
                                    <li>Git workflow</li>
                                    <li>Gulp/Webpack</li>
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
                                He configures the application using ECMAScript to establish the URLs, routes, and models used by whichever site or application I help build.
                            </li>
                            <li>
                                Sam initializes the application using
                                <pre><code className={'bash'}>cd /var/www/new-site/app && npm run init</code></pre>
                                Which installs packages from <a href="https://getcomposer.org/">composer</a> and
                                <a href="https://www.npmjs.com/">NPM</a>, and pulls updated libraries from <a href="https://github.com/spwashi">github</a>
                            </li>
                        </ol>
                    </div>
                </ContentSection>
                <ContentSection name={'to-do'}>
                    <h2>To Do:</h2>
                    <ul>
                        <li>
                            Better Documentation!
                            <ul>
                                <li><Link to={DEV__PATH}>The Developer's Interface</Link></li>
                                <li><ContentSectionLink anchor="how-I-work">"How I Work" Section</ContentSectionLink></li>
                            </ul>
                        </li>
                        <li>Responsiveness/Mobile-friendliness</li>
                    </ul>
                </ContentSection>
            </PageContent>
        );
    }
}