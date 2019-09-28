import spawn from 'cross-spawn'
import { SpawnSyncReturns } from 'child_process'
import { exists, empty } from '@what-src/utils'

/**
 * returns the result of a sync spawn call or throws an error.
 *
 * @template T
 * @param {SpawnSyncReturns<T>} result
 * @returns
 */
export const outputOrThrow = <T>(result: SpawnSyncReturns<T>) => {
  if (exists(result.error)) {
    throw result.error
  }
  return result.stdout
}

/**
 * returns true if git is installed, false otherwise.
 *
 * @returns
 */
export const isGitInstalled = () => {
  const result = spawn.sync('git', ['--version'])
  return (outputOrThrow(result) + '').trim().search(/git version /) === 0
}

/**
 * returns true if called from inside a git worktree, false otherwise.
 *
 * @returns
 */
export const isInsideGitWorkTree = () => {
  const result = spawn.sync('git', ['rev-parse', '--is-inside-work-tree'])
  return (outputOrThrow(result) + '').trim() === 'true'
}

/**
 * returns the remote url of the current git worktree or throws an error.
 *
 * @returns
 */
export const getGitRemoteOriginUrl = () => {
  const result = spawn.sync('git', ['config', '--get', 'remote.origin.url'])
  const remotename = (outputOrThrow(result) + '').trim()
  if (empty(remotename)) { throw new Error() } else return remotename
}

/**
 * returns a relative path to the root worktree directory for a given file.
 * the file must be tracked by the current repo otherwise an error is thrown.
 *
 * @param {string} filepath
 * @returns
 */
export const getGitFileFullName = (filepath: string) => {
  const result = spawn.sync('git', ['ls-files', '--full-name', filepath])
  const filename = (outputOrThrow(result) + '').trim()
  if (empty(filename)) { throw new Error() } else return filename
}

/**
 * returns the name of the currently toggled git branch or throws an error
 * if not inside a git worktree.
 *
 * @returns
 */
export const getGitBranchName = () => {
  const result = spawn.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  const branchname = (outputOrThrow(result) + '').trim()
  if (empty(branchname)) { throw new Error() } else return branchname
}
