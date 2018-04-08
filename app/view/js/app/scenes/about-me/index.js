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
    render() {
        return (
            <PageContent pageTitle="Link One" pageClass={`.page--__--${pageClassName}`}>
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
                    <p>
                        <ContentSectionLink anchor="to-do">To Do! </ContentSectionLink>{'Sam needs to work on documenting my code better. This is the basic process:'}
                    </p>
                    <ol>
                        <li>Sam wants to create a new website or application</li>
                        <li>
                            Sam <a href="https://git-scm.com/docs/git-clone">clones</a> my source code into wherever he's building his project,
                            for example <code>/var/www/new-site</code>, and initializes the application using
                            <code>cd /var/www/new-site/app && npm run init</code>.
                            <ol>
                                <li>This installs packages from <a href="https://getcomposer.org/">composer</a> and
                                    <a href="https://www.npmjs.com/">NPM</a>, and pulls updated libraries from github
                                </li>
                            </ol>
                        </li>
                        <li>...</li>
                    </ol>
                </ContentSection>
                <ContentSection name={'to-do'}>
                    <h2>To Do:</h2>
                    <ul>
                        <li>Document the <Link to={DEV__PATH}>Dev Interface</Link> and <ContentSectionLink anchor="how-I-work">How I Work" Section</ContentSectionLink> more thoroughly</li>
                    </ul>
                </ContentSection>
            </PageContent>
        );
    }
}