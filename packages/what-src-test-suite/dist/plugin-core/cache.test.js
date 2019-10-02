"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const T = tslib_1.__importStar(require("@what-src/plugin-core"));
const service = T.getService({
    basedir: '/home/user/app/packages/',
    cache: {},
    options: {},
});
it('caches source locations', () => {
    const testArgs = [
        [{ column: 1, line: 2 }, '/home/user/app/packages/filename1.ts'],
        [{ column: 4, line: 37 }, '/home/user/app/packages/deep/filename2.ts'],
        [{ column: 43, line: 1 }, '/home/user/app/packages/deep/deeper/filename3.ts'],
        [{ column: 3, line: 12 }, '/home/user/app/packages/deep/deeper/deepest/filename4.ts'],
        [{ column: 34, line: 51 }, '/home/user/app/packages/deep/deeper/deepest/filename5.ts'],
    ];
    const cacheKeys = [];
    testArgs.forEach(test => {
        cacheKeys.push(service.cache(test[0], test[1]));
    });
    expect(service.getCache()).toMatchSnapshot();
});
//# sourceMappingURL=cache.test.js.map