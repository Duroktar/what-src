import * as T from '@what-src/plugin-core'
import spawn from 'cross-spawn'
import { SpawnSyncReturns } from 'child_process'

type ResType = {
  error?: any
  stdout?: string
}

const getMockSpawn = (res: ResType = {
  error: undefined,
  stdout: '',
}) => ({
  sync(cmd: string, args: string[]) {
    return res as SpawnSyncReturns<any>
  },
}) as any as typeof spawn

describe('git utilities', () => {
  describe('shell wrappers', () => {
    it('tells if git is instatlled or not', () => {
      expect(
        T.isGitInstalled(getMockSpawn({ stdout: 'git version 1' }))
      ).toBeTruthy()
      expect(
        T.isGitInstalled(getMockSpawn({ stdout: 'git not installed' }))
      ).not.toBeTruthy()
    })
    it('tells if git is inside a git repo or not', () => {
      expect(
        T.isInsideGitWorkTree(getMockSpawn({ stdout: 'true' }))
      ).toBeTruthy()
      expect(
        T.isInsideGitWorkTree(getMockSpawn({ stdout: 'false' }))
      ).not.toBeTruthy()
    })
    it('can get the current repositories remote url if it has one', () => {
      expect(
        T.getGitRemoteOriginUrl(getMockSpawn({ stdout: 'https://github.com/Duroktar' }))
      ).toBeTruthy()
      expect(
        () => T.getGitRemoteOriginUrl(getMockSpawn({ stdout: '' }))
      ).toThrow()
    })
    it('can get the github url of a local file in the current repo if it exists', () => {
      expect(
        T.getGitFileFullName('myfile.ts', getMockSpawn({ stdout: 'https://github.com/Duroktar/what-src/master/.../.../myfile.ts' }))
      ).toBeTruthy()
      expect(
        () => T.getGitFileFullName('myfile.ts', getMockSpawn({ stdout: '' }))
      ).toThrow()
    })
    it('get the name of the currently checked out branch if it exists', () => {
      expect(
        T.getGitBranchName(getMockSpawn({ stdout: 'master' }))
      ).toBeTruthy()
      expect(
        () => T.getGitBranchName(getMockSpawn({ stdout: '' }))
      ).toThrow()
    })
  })

  describe('output or throw helper', () => {
    const mockSpawnSyncResult: SpawnSyncReturns<any> = {
      error: null,
      stdout: null,
    } as any

    it('works when it should', () => {
      const results = {
        res: null as any,
        err: null as any,
      }
      try {
        T.outputOrThrow({
          ...mockSpawnSyncResult,
          stdout: 'yes',
        })
        results.res = true
      } catch (err) {
        results.err = err
      }

      expect<string>(results.res).toBeTruthy()
      expect<string>(results.err).not.toBeTruthy()
    })

    it('fails when it should', () => {
      const results = {
        res: null as any,
        err: null as any,
      }
      try {
        T.outputOrThrow({
          ...mockSpawnSyncResult,
          error: new Error(),
        })
        results.res = true
      } catch (err) {
        results.err = err
      }

      expect<string>(results.err).toBeTruthy()
      expect<string>(results.res).not.toBeTruthy()
    })
  })
})
