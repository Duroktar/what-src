"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNullOrUndefined(object) {
    return (object === null || object === undefined);
}
exports.isNullOrUndefined = isNullOrUndefined;
exports.getIn = (p, o) => {
    if (!Array.isArray(p)) {
        p = p.split('.');
    }
    return p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);
};
