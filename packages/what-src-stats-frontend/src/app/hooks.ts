import React, { useEffect, useState } from 'react'
import * as ReactCountUp from 'react-countup'
import { retryOperation, withOnOff } from '@what-src/utils'
import humanizeDuration from 'humanize-duration'
import { BackgroundType } from './components/backgrounds'
import { fetchClicks, streamUpdates } from '../stitch'
import { FIVE_SECONDS } from '../constants'
const { useCountUp } = ReactCountUp as any // type hack

export const useComponentState = () => {
  const [durationText, setDurationText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [background, setBackground] = useState<BackgroundType>('Cloudy Day')
  const [tick, setTick] = useState(0)
  const [nice, setNice] = useState(false)
  const [loading, setLoading] = useState(false)
  const { countUp, update } = useCountUp({ start: 0, end: 0, duration: 5 })

  const handleRefresh = React.useCallback(() => setTick(tick + 1), [])

  useEffect(() => {
    let disposable = () => {}
    (function connect() {
      withOnOff(setLoading, async() => {
        try {
          type ApiResponse = { total: number }
          const res: ApiResponse = await retryOperation(fetchClicks, 5000, 25)
          if (res.total) {
            update(res.total)
            setDurationText(humanizeDuration(res.total * 1000))
            setError(null)
            if (!nice) {
              setTimeout(() => {
                streamUpdates(stream => {
                  update(stream.total)
                }).then(listener => {
                  disposable = listener
                })
                setNice(true)
              }, FIVE_SECONDS + 460)
            }
          } else {
            setError('Something is wrong..')
            setTimeout(() => { connect() }, 1000)
          }
        } catch (err) {
          if (err.message !== 'internal server error') setError(err.message)
          else setError('Error connecting to server. Waiting awhile before trying again.')
          setTimeout(() => { connect() }, 30000)
        }
      })
    })()
    return () => disposable()
  }, [])

  const humanized = React.useMemo(() =>
    humanizeDuration(countUp * 1000), [countUp])

  const humanTime = React.useMemo(() => {
    return !nice ? durationText : humanized
  }, [nice, durationText, humanized])

  const niceStyle = React.useMemo(() => {
    return { visibility: !nice ? 'hidden' : 'visible' }
  }, [nice])

  return {
    durationText,
    error,
    background,
    setBackground,
    humanized,
    tick,
    countUp,
    nice,
    setTick,
    handleRefresh,
    humanTime,
    niceStyle,
    loading,
  }
}
