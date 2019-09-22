import spawn from 'cross-spawn'
import { SpawnSyncReturns } from 'child_process'
import { exists } from '@what-src/utils'

export const outputOrThrow = <T>(result: SpawnSyncReturns<T>) => {
  if (exists(result.error)) {
    throw result.error
  }
  return result.stdout
}

export const getGitRemoteUrl = () => {
  const result = spawn.sync('git', ['config', '--get', 'remote.origin.url'])
  return (outputOrThrow(result) + '').trim()
}

export const getRelativeGitFileUrl = (filepath: string) => {
  const result = spawn.sync('git', ['ls-files', '--full-name', filepath])
  return (outputOrThrow(result) + '').trim()
}

export const getGitBranchName = () => {
  const result = spawn.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  return (outputOrThrow(result) + '').trim()
}
