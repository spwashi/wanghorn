import React from "react"
import * as PropTypes from "prop-types"
import Lorem from "react-lorem-component";
import {ContentSection, ContentSectionLink, PageContent} from "../../components/page";

const pageClassName = 'linkOne';

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
                        <li><ContentSectionLink anchor="content-1">Content 1</ContentSectionLink></li>
                        <li><ContentSectionLink anchor="content-2">Content 2</ContentSectionLink></li>
                        <li><ContentSectionLink anchor="content-3">Content 3</ContentSectionLink></li>
                        <li><ContentSectionLink anchor="content-4">Content 4</ContentSectionLink></li>
                    </ul>
                </nav>
                <ContentSection name={'content-1'}>
                    <InlineDisplayContainer>
                        <DisplayItem title={'Content-1--thing'}
                                     caption={'Puts the stuff where you need it'}><Lorem count={1} /></DisplayItem>
                        <DisplayItem title={'Content-1--thing'}
                                     caption={'Puts the stuff where you need it'}><Lorem count={1} /></DisplayItem>
                        <DisplayItem title={'Content-1--thing'}
                                     caption={'Puts the stuff where you need it'}><Lorem count={1} /></DisplayItem>
                    </InlineDisplayContainer>
                </ContentSection>
                <ContentSection name={'content-2'}><Lorem /></ContentSection>
                <ContentSection name={'content-3'}><Lorem /></ContentSection>
                <ContentSection name={'content-4'}><Lorem /></ContentSection>
            </PageContent>
        );
    }
}