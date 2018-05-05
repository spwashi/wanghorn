import React from "react"
import {Route} from "react-router-dom"
import {withRouter} from "react-router"
import Gallery, {itemToImg} from "./components";
import {PageContent} from "../../components/page";
import {activateTag, deactivateTag, fetchGalleryItems} from "./actions";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import {from_gallery_selectAllTags, selectActiveGalleryItems, selectActiveTagIDs, selectNamedItemFromItemList} from "./selector";
import {getURI} from "../../../path/resolution";
import Modal from "../../components/modal";
import Item from "./components/item/item";
import * as PropTypes from "prop-types"

class GalleryPage extends React.Component {
    static contextTypes = {
        router: PropTypes.func.isRequired
    };
    
    render() {
        let itemModalURI = getURI('gallery--item__view', null, {skipEmpty: true, asReactRoute: true});
        let items        = this.props.items;
        
        return (
            <PageContent pageTitle="Gallery" pageClass=".page--__--gallery">
                <Gallery {...this.props} />
                <Route path={itemModalURI}
                       component={({match}) => {
                           const {params} = match;
                           const item     = selectNamedItemFromItemList(items, params.name);
                           return (
                               <Modal isOpen={true} contentLabel={name} onRequestClose={this.context.router.history.goBack} title={item.title}>
                                   <Item  {...item} img={itemToImg(item)} isExpanded={true} />
                               </Modal>)
                       }} />
            </PageContent>
        );
    }
}

const mapState         = state => {
    const items      = selectActiveGalleryItems(state);
    const tags       = from_gallery_selectAllTags(state);
    const activeTags = selectActiveTagIDs(state);
    return {items, tags, activeTags};
};
const mapDispatch      = dispatch => bindActionCreators({activateTag, deactivateTag, fetchGalleryItems}, dispatch);
const connectOnGallery = connect(mapState, mapDispatch);
export default withRouter(connectOnGallery(GalleryPage))