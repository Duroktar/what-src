import * as React from 'react'
import i18n from 'i18next'
import { App } from './component'

export class AppContainer extends React.PureComponent<ContainerProps, State> {
  private STORAGE_KEY = '__bf_storage__theme';
  public state: State = AppContainer.DEFAULT_STATE;

  componentDidMount() {
    this.loadTheme().then(this.setTheme)
    this.setState({ locale: i18n.language })
  }

  public render() {
    const { component: Component } = this.props
    return (
      <Component
        setTheme={this.setTheme}
        currentTheme={this.props.theme}
        locale={this.state.locale}
      />)
  }

  private loadTheme = async() => {
    const theme = localStorage.getItem(this.STORAGE_KEY)
    return this.isValidTheme(theme) ? theme : null
  }

  private persistTheme = async(theme: string) => {
    if (this.isValidTheme(theme)) {
      localStorage.setItem(this.STORAGE_KEY, theme)
      return true
    }
    return false
  }

  private isValidTheme(theme: string | null): theme is 'light' | 'dark' {
    return ['light', 'dark'].includes(theme || '')
  }

  public setTheme = (theme: string | null) => {
    if (this.isValidTheme(theme)) {
      this.props.setTheme(theme)
      this.persistTheme(theme)
    }
  }

  static DEFAULT_STATE: State = {
    locale: '',
  };
}

type ContainerProps = {
  component: typeof App;
  setTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
  authenticated: boolean;
};

type State = {
  locale: string;
};
