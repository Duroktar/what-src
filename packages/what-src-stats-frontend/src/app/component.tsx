import * as React from 'react'
import { withTheme } from 'emotion-theming'
import { Text } from 'rebass'
import { When } from 'react-if'
import Head from './components/head'
import Nav from './components/nav'
import { Arrow } from './components/arrow'
import { Info } from './components/info'
import { Loading } from './components/loading'
import { Logo } from './components/logo'
import { Toast } from './components/toast'
import { BackGroundComponent } from './components/backgrounds'
import { useComponentState } from './hooks'
import { IMG_CONFIG_BASIC, IMG_BASE_URL } from '../constants'

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
          <h1 className="row logo">
            <Logo />
          </h1>
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
              <span className="loading">
                <Loading />
              </span>
            </When>
          </span>
        </div>
        <div className="example">
          <div id='arrow'><Arrow down={!state.toast} /></div>
          <Toast
            id="toast"
            onClick={state.toggleToast}
            src={IMG_BASE_URL + IMG_CONFIG_BASIC}
          />
        </div>
        <div className='footer'>
          <div
            id="refresh-btn"
            role="button"
            tabIndex={0}
            onClick={state.handleRefresh}
            className={!error ? 'hidden' : undefined}
          >
            {t('Refresh')}
          </div>
          <button
            id="info-bubble"
            role="button"
            name="information"
            tabIndex={-1}
            onClick={state.handleRefresh}
          >
            <Info txt={t('INFO-TXT')} />
          </button>
        </div>
      </div>
    </BackGroundComponent>
  )
}))
