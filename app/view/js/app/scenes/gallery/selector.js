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
export function selectActiveGalleryItems(state) {
    const convertToTagID   = ({tag, category}) => `${category}__${tag}`;
    const items            = selectGalleryItems(state);
    const activeTags       = from_gallery_selectActiveTags(state).map(convertToTagID);
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