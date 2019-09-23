import { retryOperation } from '@what-src/utils'
import {
  AnonymousCredential,
  RemoteMongoClient,
  Stitch,
} from 'mongodb-stitch-browser-sdk'

const client = Stitch.initializeDefaultAppClient('triggers_stitchapp-hnsgo')

const db = client.getServiceClient(RemoteMongoClient.factory, 'Lilo').db('stats')

/**
 * basic client to server authentication. not for the user
 *
 * @returns
 */
function authenticateAnonymousCredentials() {
  return client.auth.loginWithCredential(new AnonymousCredential())
}

/**
 * main service for running client auth. attempts to reconnect automatically
 *
 * @param {Function} cb
 */
export const registerStitchAuthentication = (cb: Function) => {
  retryOperation(authenticateAnonymousCredentials, 5000, 25)
    .then(() => cb())
    .catch((err) => {
      console.error(err)
      registerStitchAuthentication(cb)
    })
}

/**
 * gets the current click count from the server
 *
 * @returns {Promise<{total: number}>}
 */
export const fetchClicks = (): Promise<{total: number}> => {
  return client.callFunction('count', [])
    .then(({ total }) => {
      return { total: total * 10 /* TODO: Make this the avg of some votable amount */ }
    })
}

/**
 * subscribes to an update stream of clicks from the server
 *
 * @param {(n: { total: number }) => void} handler
 * @returns
 */
export const streamUpdates = async(
  handler: (n: { total: number }) => void
) => {
  const stream = await db.collection('clicks').watch()
  stream.onNext(() => {
    fetchClicks().then(handler)
  })
  return () => stream.close()
}
