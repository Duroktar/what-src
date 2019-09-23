import React, { useEffect, useState } from 'react'
import * as ReactCountUp from 'react-countup'
import { useTranslation } from 'react-i18next'
import { getIn, retryOperation, withOnOff } from '@what-src/utils'
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
  const { t } = useTranslation()

  useEffect(() => {
    let disposable = () => {}
    (function connect() {
      disposable()
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
                }).catch(err => {
                  setError(getIn('message', err, t('Stream subscription error')))
                  setTimeout(() => { connect() }, 5000)
                })
                setNice(true)
              }, FIVE_SECONDS + 460)
            }
          } else {
            setError(t('Something went wrong..'))
            setTimeout(() => { connect() }, 1000)
          }
        } catch (err) {
          setError(getIn('message', err, t('Internal server error')))
          setTimeout(() => { connect() }, 30000)
          console.error(err)
        }
      })
    })()
    return () => {
      console.log('disposing!')
      disposable()
    }
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
    t,
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
