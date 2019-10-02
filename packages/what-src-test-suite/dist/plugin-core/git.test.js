"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const T = tslib_1.__importStar(require("@what-src/plugin-core"));
const getMockSpawn = (res = {
    error: undefined,
    stdout: '',
}) => ({
    sync(cmd, args) {
        return res;
    },
});
describe('git utilities', () => {
    describe('shell wrappers', () => {
        it('tells if git is instatlled or not', () => {
            expect(T.isGitInstalled(getMockSpawn({ stdout: 'git version 1' }))).toBeTruthy();
            expect(T.isGitInstalled(getMockSpawn({ stdout: 'git not installed' }))).not.toBeTruthy();
        });
        it('tells if git is inside a git repo or not', () => {
            expect(T.isInsideGitWorkTree(getMockSpawn({ stdout: 'true' }))).toBeTruthy();
            expect(T.isInsideGitWorkTree(getMockSpawn({ stdout: 'false' }))).not.toBeTruthy();
        });
        it('can get the current repositories remote url if it has one', () => {
            expect(T.getGitRemoteOriginUrl(getMockSpawn({ stdout: 'https://github.com/Duroktar' }))).toBeTruthy();
            expect(() => T.getGitRemoteOriginUrl(getMockSpawn({ stdout: '' }))).toThrow();
        });
        it('can get the github url of a local file in the current repo if it exists', () => {
            expect(T.getGitFileFullName('myfile.ts', getMockSpawn({ stdout: 'https://github.com/Duroktar/what-src/master/.../.../myfile.ts' }))).toBeTruthy();
            expect(() => T.getGitFileFullName('myfile.ts', getMockSpawn({ stdout: '' }))).toThrow();
        });
        it('get the name of the currently checked out branch if it exists', () => {
            expect(T.getGitBranchName(getMockSpawn({ stdout: 'master' }))).toBeTruthy();
            expect(() => T.getGitBranchName(getMockSpawn({ stdout: '' }))).toThrow();
        });
    });
    describe('output or throw helper', () => {
        const mockSpawnSyncResult = {
            error: null,
            stdout: null,
        };
        it('works when it should', () => {
            const results = {
                res: null,
                err: null,
            };
            try {
                T.outputOrThrow({
                    ...mockSpawnSyncResult,
                    stdout: 'yes',
                });
                results.res = true;
            }
            catch (err) {
                results.err = err;
            }
            expect(results.res).toBeTruthy();
            expect(results.err).not.toBeTruthy();
        });
        it('fails when it should', () => {
            const results = {
                res: null,
                err: null,
            };
            try {
                T.outputOrThrow({
                    ...mockSpawnSyncResult,
                    error: new Error(),
                });
                results.res = true;
            }
            catch (err) {
                results.err = err;
            }
            expect(results.err).toBeTruthy();
            expect(results.res).not.toBeTruthy();
        });
    });
});
//# sourceMappingURL=git.test.js.map