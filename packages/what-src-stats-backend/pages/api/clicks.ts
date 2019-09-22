import { NowRequest, NowResponse } from '@now/node'
import humanizeDuration from 'humanize-duration'
import Cors from 'micro-cors'
import { client } from '../../lib/mongodb'

const cors = Cors({
  allowMethods: ['GET', 'POST'],
})

const lostSecAvg = 10

const handler = async(req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === 'GET') {
      const clicks = await client
        .db('stats')
        .collection('clicks')
        .estimatedDocumentCount()
      const totalSeconds = clicks * lostSecAvg
      const milliseconds = totalSeconds * 1000
      res.json({
        total: clicks,
        ok: true,
        seconds: totalSeconds,
        milliseconds,
        durationText: humanizeDuration(milliseconds),
      })
    } else
    if (req.method === 'POST') {
      await client
        .db('stats')
        .collection('clicks')
        .insertOne({ location: null, timestamp: new Date().toUTCString() })
      res.json({ ok: true })
    } else {
      res.json({ ok: false, errorMessage: 'method not allowed' })
    }
  } catch {
    res.json({ ok: false, errorMessage: 'internal server error' })
  }
  return res.end()
}

export default cors(handler as any)
