import {
  Stitch,
  RemoteMongoClient,
} from 'mongodb-stitch-browser-sdk'

const client = Stitch.initializeDefaultAppClient('triggers_stitchapp-hnsgo')

const db = client.getServiceClient(RemoteMongoClient.factory, 'Lilo').db('stats')

export const fetchClicks = (): Promise<{total: number}> => {
  return client.callFunction('count', [])
    .then(({ total }) => ({ total: total * 10 /* TODO: Make this the avg of some votable amount */ }))
}

export const streamUpdates = async(
  handler: (n: { total: number }) => void
) => {
  const stream = await db.collection('clicks').watch()
  stream.onNext(() => fetchClicks().then(handler))
  return () => stream.close()
}
