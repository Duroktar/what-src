"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const U = tslib_1.__importStar(require("@what-src/utils"));
describe('what-src common utilities', () => {
    describe('getIn', () => {
        it('should work for test inputs', () => {
            const testObj = { a: { b: { c: 42 } } };
            const cases = [
                { value: ['a', testObj], expectedResult: testObj.a },
                { value: ['a.b', testObj], expectedResult: testObj.a.b },
                { value: ['a.b.c', testObj], expectedResult: 42 },
                { value: [['a', 'b'], testObj], expectedResult: testObj.a.b },
                { value: [['a', 'b', 'c'], testObj], expectedResult: 42 },
                { value: ['a.b.nope', testObj], expectedResult: undefined },
                { value: ['z', testObj], expectedResult: undefined },
            ];
            cases.forEach(({ value, expectedResult }) => {
                expect(U.getIn(value[0], value[1])).toEqual(expectedResult);
            });
        });
        it('should fail on input of the wrong type\n' +
            '\tbut not if passed a null or undefined object', () => {
            expect(() => U.getIn(undefined, {})).toThrow();
            expect(() => U.getIn(null, {})).toThrow();
            expect(() => U.getIn(0, {})).toThrow();
            expect(() => U.getIn({}, {})).toThrow();
            expect(() => U.getIn('', undefined)).not.toThrow();
            expect(() => U.getIn('', null)).not.toThrow();
        });
    });
    describe('capitalize', () => {
        it('should work for test inputs', () => {
            const cases = [
                { value: 'harry', expectedResult: 'Harry' },
                { value: 'harry houdini', expectedResult: 'Harry houdini' },
            ];
            cases.forEach(({ value, expectedResult: result }) => {
                expect(U.capitalize(value)).toEqual(result);
            });
        });
    });
    describe('toCamelCase', () => {
        it('should work for test inputs', () => {
            const cases = [
                { value: 'StanMarsh', expectedResult: 'stanMarsh' },
                { value: 'Stan Marsh', expectedResult: 'stanMarsh' },
                { value: 'harry houdini', expectedResult: 'harryHoudini' },
                { value: 'Harry-houdini', expectedResult: 'harryHoudini' },
                { value: 'stan marsh harry-houdini', expectedResult: 'stanMarshHarryHoudini' },
                { value: 'Stan marsh loves harry-houdini', expectedResult: 'stanMarshLovesHarryHoudini' },
                { value: 'harryhoudini', expectedResult: 'harryhoudini' },
            ];
            cases.forEach(({ value, expectedResult: result }) => {
                expect(U.toCamelCase(value)).toEqual(result);
            });
        });
    });
    describe('withOnOff', () => {
        it('should call the toggle with true before calling the\n' +
            '\tcb and then finally calling the toggle again with false', async () => {
            const states = [];
            const toggle = (n) => states.push(n);
            await U.withOnOff(toggle, async () => {
                states.push(42);
            });
            expect(states).toEqual([true, 42, false]);
        });
    });
    describe('withHooks', () => {
        it('should call the before hook before\n' +
            '\tcalling the callback and then finally\n' +
            '\tcalling the after hook with the result', () => {
            const states = [];
            const callback = (n) => states.push(n);
            U.withHooks(() => { callback(7); return 1; }, {
                before: () => callback(2),
                after: (r) => callback(41 + r),
            });
            expect(states).toEqual([2, 7, 42]);
        });
    });
    describe('asynchronous wait function', () => {
        it('works as intended', async () => {
            const before = Date.now();
            await U.wait(1000);
            const delta = Date.now() - before;
            expect(delta > 900).toBeTruthy();
        });
    });
    describe('asynchronous retry function', () => {
        const getState = () => {
            let state = 0;
            const incrementCounter = () => state++;
            const operation = () => new Promise((resolve, reject) => {
                incrementCounter();
                if (state < 3) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject();
                }
                else {
                    resolve();
                }
            });
            return { state, incrementCounter, operation };
        };
        const getTest = async (n, d = 1) => {
            const { operation } = getState();
            const state = {
                res: null,
                err: null,
            };
            try {
                await U.retryOperation(operation, d, n);
                state.res = true;
            }
            catch (err) {
                state.err = err;
            }
            return state;
        };
        it('fails when retries exceed limit (1)', async () => {
            const state = await getTest(1);
            expect(state.res).toBeNull();
            expect(state.err).not.toBeNull();
        });
        it('fails when retries exceed limit (2)', async () => {
            const state = await getTest(2);
            expect(state.res).toBeNull();
            expect(state.err).not.toBeNull();
        });
        it('succeeds when operation resolves within retry limit (1)', async () => {
            const state = await getTest(3);
            expect(state.res).not.toBeNull();
            expect(state.err).toBeNull();
        });
        it('succeeds when operation resolves within retry limit (2)', async () => {
            const state = await getTest(4);
            expect(state.res).not.toBeNull();
            expect(state.err).toBeNull();
        });
    });
    describe('assorted utilites', () => {
        it('exists works as intended', () => {
            expect(U.exists('')).toEqual(true);
            expect(U.exists(0)).toEqual(true);
            expect(U.exists(42)).toEqual(true);
            expect(U.exists({})).toEqual(true);
            expect(U.exists([])).toEqual(true);
            expect(U.exists(null)).toEqual(false);
            expect(U.exists(undefined)).toEqual(false);
        });
        it('is (null | undefined) type guards', () => {
            expect(U.isNull('')).toEqual(false);
            expect(U.isNull(null)).toEqual(true);
            expect(U.isNull(undefined)).toEqual(false);
            expect(U.isUndefined('')).toEqual(false);
            expect(U.isUndefined(null)).toEqual(false);
            expect(U.isUndefined(undefined)).toEqual(true);
            expect(U.isNullOrUndefined('')).toEqual(false);
            expect(U.isNullOrUndefined(null)).toEqual(true);
            expect(U.isNullOrUndefined(undefined)).toEqual(true);
        });
        it('empty works as intended', () => {
            expect(U.empty('')).toEqual(true);
            expect(U.empty([])).toEqual(true);
            expect(U.empty('hi')).toEqual(false);
            expect(U.empty([42])).toEqual(false);
        });
        it('try works as intended', async () => {
            const res = await U.λTry(() => Promise.resolve(1));
            const rej = await U.λTry(() => { throw new Error(); });
            expect(res.data).toBeTruthy();
            expect(res.err).not.toBeTruthy();
            expect(rej.err).toBeTruthy();
            expect(rej.data).not.toBeTruthy();
        });
    });
});
//# sourceMappingURL=basic.test.js.map