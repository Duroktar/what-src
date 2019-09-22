import React, { useEffect, useState } from 'react'
import * as ReactCountUp from 'react-countup'
import humanizeDuration from 'humanize-duration'
import { BackgroundType } from './components/backgrounds'
import { ONE_SECOND, endpoint, FIVE_SECONDS } from '../constants'

export const useComponentState = () => {
  const [durationText, setDurationText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [background, setBackground] = useState<BackgroundType>('Cloudy Day')
  const [tick, setTick] = useState(0)
  const [nice, setNice] = useState(false)
  const [loading, setLoading] = useState(false)
  const { countUp, update } = (ReactCountUp as any).useCountUp({ start: 0, end: 0, duration: 5 })

  const handleRefresh = React.useCallback(() => setTick(tick + 1), [])

  useEffect(() => {
    async function getCount() {
      let nextUpdate = ONE_SECOND
      setLoading(true)
      try {
        const res = await (await fetch(endpoint)).json()
        if (res.ok) {
          nextUpdate = FIVE_SECONDS
          update(res.seconds)
          setDurationText(res.durationText)
          setError(null)
          if (!nice) {
            setTimeout(() => setNice(true), FIVE_SECONDS + 460)
          }
        } else {
          setError(res.errorMessage)
        }
      } catch (e) {
        if (e.message !== 'internal server error') setError(e.message)
        else setError('Connecting..')
      } finally {
        setLoading(false)
        setTimeout(() => setTick(tick + 1), nextUpdate)
      }
    }
    getCount().catch(e => setError(e.message))
  }, [tick])

  const humanized = React.useMemo(() =>
    humanizeDuration((countUp as any) * 1000), [countUp])

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
