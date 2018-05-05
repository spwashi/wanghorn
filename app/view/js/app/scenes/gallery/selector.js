export function selectGallery(state) {
    return state.scenes.gallery || [];
}

export function from_galleryItems__selectAllTags(items) {
    return items.map(item => item.tags).reduce(reduceItemTagObjectIntoAll, {});
    function reduceItemTagObjectIntoAll(allTagsByIndex, galleryItemTagObject) {
        const entries        = Object.entries(galleryItemTagObject);
        const appendTagEntry = (all, tagEntry) => {
            let [galleryIndex, tags] = tagEntry;
            if (!Array.isArray(tags)) {
                return all;
            }
            const merged      = [...(all[galleryIndex] || []), ...tags];
            all[galleryIndex] = [...new Set(merged)];
            return all;
        };
        return entries.reduce(appendTagEntry, allTagsByIndex);
    }
}
// tags
export function from_gallery_selectAllTags(state) {
    const items = selectGalleryItems(state);
    return from_galleryItems__selectAllTags(items);
}
export function from_gallery_selectActiveTags(state) {
    const {activeTags} = selectGallery(state);
    return activeTags;
}

// items
export function selectGalleryItems(state) {
    const {items} = selectGallery(state);
    return items;
}
function convertToTagID({tag, category}) {return `${category}__${tag}`;}
export const selectActiveTagIDs = function (state) {
    let activeTags = from_gallery_selectActiveTags(state).map(convertToTagID);
    activeTags     = [...new Set(activeTags || [])];
    return activeTags;
};
export function selectActiveGalleryItems(state) {
    const items            = selectGalleryItems(state);
    let activeTags         = selectActiveTagIDs(state);
    const itemHasActiveTag = item => {
        let hasActiveTag = false;
        Object.entries(item.tags)
              .forEach(([category, tag_arr]) => {
                  if (hasActiveTag) return;
                  tag_arr.map(tag => {
                      if (hasActiveTag) return;
                      const tag_id = convertToTagID({tag: tag.name, category});
                      if (activeTags.indexOf(tag_id) >= 0) {
                          hasActiveTag = true;
                      }
                
                  });
              });
        return hasActiveTag;
    };
    return !activeTags.length ? items
                              : items.filter(itemHasActiveTag);
}
export function selectNamedItemFromItemList(items, name) {
    return items.reduce((match, item) => {
        console.log(name);
        return match || (item && item.name === name && item) || null;
    }, null)
}