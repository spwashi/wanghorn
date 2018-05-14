export const getViewportDimensions = () => {
    const width  = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return {width, height}
};
export const randomString          = (strlen = 5) => {
    let text       = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < strlen; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
};

export const reduceEntriesIntoObject = (obj, [k, v]) => ((obj[k] = v), obj);