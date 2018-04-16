import {GALLERY_ITEMS} from "../../../paths";
import axios from "axios"

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
