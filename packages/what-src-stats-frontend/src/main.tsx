import '@babel/polyfill'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'emotion-theming'
import { AppContainer } from './app/container'
import { App } from './app/component'
import { themes, presets } from './themes'
import { ThemeName } from './themes/theme'

import './styles'
import './i18n'

const Main = () => {
  const [theme, setTheme] = React.useState<ThemeName>(themes[0])

  const appTheme = React.useMemo(() => presets[theme], [theme])

  return (
    <ThemeProvider theme={appTheme}>
      <AppContainer
        component={App}
        setTheme={setTheme}
        theme={theme}
      />
    </ThemeProvider>
  )
}

// accessability fallback
document.body.addEventListener('keyup', function(e) {
  if (e.which === 9) {
    document.documentElement.classList.remove('no-focus-outline')
  }
})

ReactDOM.render(<Main />, document.getElementById('root'))
