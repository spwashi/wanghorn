export const randomString = (strlen = 5) => {
    let text       = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < strlen; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
};

export const objectToMap = (obj): Map => {
    let map = new Map;
    
    Object.keys(obj)
          .forEach(key => {
              map.set(key, obj[key]);
          });
    
    return map;
};