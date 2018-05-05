const cache = {};

export function completeTag(type, config) {
    const name   = (config.name || (config.text || '').replace(/[\s]/g, ' ')).toLowerCase();
    cache [type] = cache[type] || {};
    if (cache[type][name]) return cache[type][name];
    return cache[type][name] = {name, type, ...config}
}