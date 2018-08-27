import React from "react"

export class Factory {
    _resolvers = [];
    defaultResolver = function () {
    };

    constructor(resolver = []) {
        this.pushResolver(this.defaultResolver);
        this.pushResolver(resolver);
    }

    pushResolver(resolver) {
        if (typeof resolver === "function") resolver = [resolver];

        if (!Array.isArray(resolver)) throw new Error("Can only register functions or arrays of functions");

        this._resolvers = [...this._resolvers, ...resolver];
        return this;
    }

    Component = props => {
        let Item;
        for (let i = this._resolvers.length; i--;) {
            const resolver = this._resolvers[i];
            Item = resolver(props);
            if (Item) {
                return React.Component.isPrototypeOf(Item) ? <Item{...props} />
                    : Item;
            }
        }
        return Item ? Item : null;
    }
}