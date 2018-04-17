import {GALLERY_ITEMS} from "../../../paths";
import axios from "axios"

// FETCHING ITEMS
export const FETCH_GALLERY_BEGIN        = "FETCH_GALLERY_BEGIN";
export const FETCH_GALLERY_RECEIVED     = "FETCH_GALLERY_RECEIVED";
export const fetchGalleryItemsBegin     = () => ({type: FETCH_GALLERY_BEGIN});
export const fetchGalleryItemsCompleted = items => ({
    type: FETCH_GALLERY_RECEIVED,
    items
});
export const fetchGalleryItems          = () => {
    return dispatch => {
        dispatch(fetchGalleryItemsBegin());
        
        return axios.get(GALLERY_ITEMS)
                    .then(response => {
                        const items = response && response.data && response.data;
                        dispatch(fetchGalleryItemsCompleted(items));
                        return items;
                    });
    }
};

// TAGS
export const ACTIVATE_TAG   = 'ACTIVATE_TAG';
export const DEACTIVATE_TAG = 'DEACTIVATE_TAG';
export const activateTag    = ({category, tag}) => ({type: ACTIVATE_TAG, category, tag});
export const deactivateTag  = ({category, tag}) => ({type: DEACTIVATE_TAG, category, tag});
