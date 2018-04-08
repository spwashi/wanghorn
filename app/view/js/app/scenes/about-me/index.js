import React from "react"
import * as PropTypes from "prop-types"
import Lorem from "react-lorem-component";
import {ContentSection, ContentSectionLink, PageContent} from "../../components/page";

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
                    </ul>
                </nav>
                <ContentSection name={'what-I-do'}>
                    <h2>What I Do</h2>
                    <ContentSection>
                        <h3>I'm a code library!</h3>
                        <p>
                            I stub out some common structures and features of web applications to help Sam
                            rapidly prototype and develop websites.
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
                        </p>
                    </ContentSection>
                </ContentSection>
                <ContentSection name={'how-I-work'}>
                    <h2>How I work</h2>
                    <Lorem />
                </ContentSection>
            </PageContent>
        );
    }
}