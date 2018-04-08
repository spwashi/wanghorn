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
                    <InlineDisplayContainer>
                        <DisplayItem title={'what-I-do--thing'}
                                     caption={'Puts the stuff where you need it'}><Lorem count={1} /></DisplayItem>
                        <DisplayItem title={'what-I-do--thing'}
                                     caption={'Puts the stuff where you need it'}><Lorem count={1} /></DisplayItem>
                        <DisplayItem title={'what-I-do--thing'}
                                     caption={'Puts the stuff where you need it'}><Lorem count={1} /></DisplayItem>
                    </InlineDisplayContainer>
                </ContentSection>
                <ContentSection name={'how-I-work'}><Lorem /></ContentSection>
            </PageContent>
        );
    }
}