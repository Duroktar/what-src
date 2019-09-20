import spawn from 'cross-spawn'
import { SpawnSyncReturns } from 'child_process'
import { isNullOrUndefined, exists } from './utils'

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

export const gitRemoteFileUrlFactory = () => {
  const remoteUrl = getGitRemoteUrl()
  const branch = getGitBranchName()
  return function getRemoteFileUrl(filepath: string) {
    const relativeFileUrl = getRelativeGitFileUrl(filepath)
    const options = { branch, filepath: relativeFileUrl }
    return makeGitFileUrl(remoteUrl, options)
  }
}

export const makeGitFileUrl = (remoteUrl: string, opts: {
  branch: string;
  filepath: string;
}) => {
  if (isNullOrUndefined(remoteUrl) || !remoteUrl.endsWith('.git')) {
    throw new Error(`${remoteUrl} is not a valid remote url.`)
  }
  return `${remoteUrl.slice(0, -4)}/blob/${opts.branch}/${opts.filepath}`
}
