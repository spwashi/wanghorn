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
export function selectActiveTags(state) {
    const {activeTags} = selectGallery(state);
    return activeTags;
}

// items
export function selectGalleryItems(state) {
    const {items} = selectGallery(state);
    return items;
}
export const from_gallery_selectActiveTagIDs = function (state) {
    let activeTags = selectActiveTags(state).map(convertToTagID);
    activeTags     = [...new Set(activeTags || [])];
    return activeTags;
};

export const convertToTagID        = ({tag, category}) => `${category}__${tag}`;
export const convertItemTagToTagID = tag => convertToTagID({tag: tag.name, category: tag.type});

export function selectActiveGalleryItems(state) {
    const items            = selectGalleryItems(state);
    let activeTagIDs       = from_gallery_selectActiveTagIDs(state);
    let activeTags         = selectActiveTags(state);
    const itemHasAllTags   = item => {
        let isMissingTag = false;
        Object.entries(activeTags)
              .forEach(([i, obj]) => {
                  if (isMissingTag) return;
                  const {category}  = obj;
                  const searchTagID = convertToTagID(obj);
                  let categoryTags  = item.tags[category] ? item.tags[category].map(convertItemTagToTagID) : null;
                  if (!categoryTags) return isMissingTag = true;
                  if (categoryTags.indexOf(searchTagID) < 0) return isMissingTag = true;
              });
        
        return !isMissingTag;
    };
    const itemHasActiveTag = item => {
        let hasActiveTag = false;
        Object.entries(item.tags)
              .forEach(([category, tag_arr]) => {
                  if (hasActiveTag) return;
            
                  tag_arr.map(tag => {
                      if (hasActiveTag) return;
                      const tag_id = convertItemTagToTagID(tag);
                      if (activeTagIDs.indexOf(tag_id) >= 0) {
                          hasActiveTag = true;
                      }
                
                  });
              });
        return hasActiveTag;
    };
    const do_or            = false;
    return !activeTagIDs.length ? items
                                : items.filter(do_or ? itemHasActiveTag : itemHasAllTags);
}
export function selectNamedItemFromItemList(items, name) {
    return items.reduce((match, item) => {
        return match || (item && item.name === name && item) || null;
    }, null)
}