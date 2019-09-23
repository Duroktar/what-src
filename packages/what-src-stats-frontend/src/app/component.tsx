import * as React from 'react'
import { withTheme } from 'emotion-theming'
import { Text } from 'rebass'
import { When } from 'react-if'
import Head from './components/head'
import Nav from './components/nav'
import { Info } from './components/info'
import { Logo } from './components/logo'
import { BackGroundComponent } from './components/backgrounds'
import { useComponentState } from './hooks'

type AppProps = {
  setTheme: (theme: string) => void
  currentTheme: string
  locale: string
}

export const App =
React.memo(withTheme((props: AppProps) => {
  const { t, error, ...state } = useComponentState()
  return (
    <BackGroundComponent background={state.background}>
      <div className="app fullscreen">
        <Head title="Home" />
        <Nav />
        <div className="msg container">
          <span className="row logo">
            <Logo />
          </span>
          <When condition={!!state.durationText}>
            <span className="row count">
              <Text fontSize={27} color='primary'>
                {t('Has saved approximately')}
              </Text>
              <Text fontSize={27} color='primary'>
                <b>{state.humanTime}</b>
              </Text>
              <Text fontSize={27} color='primary'>
                {t('of time.')}
              </Text>
              <Text fontSize={27} color='primary'>
                  ({t('About')} <b>{state.countUp} {t('seconds')}</b>..)
              </Text>
              <br />
              <Text fontSize={27} color='primary' sx={state.niceStyle}>
                <span><i>{t('Nice.')}</i></span>
              </Text>
            </span>
          </When>
          <span className="row status">
            <When condition={!error}>
              <span className="error">{error}</span>
            </When>
            <When condition={state.loading}>
              <span className="loading"></span>
            </When>
          </span>
        </div>
        <div className='footer'>
          <div id="refresh-btn" onClick={state.handleRefresh} className={!error ? 'hidden' : undefined}>
            {t('Refresh')}
          </div>
          <div id="info-bubble" onClick={state.handleRefresh}>
            <Info txt={t('INFO-TXT')} />
          </div>
        </div>
      </div>
    </BackGroundComponent>
  )
}))
