import * as React from 'react'
import { Image } from 'rebass'
import logo from '../../assets/GitHub_Logo.png'

const css = {
  width: '125px',
}

export const GitHub = React.memo(() => {
  return (
    <Image style={css} src={logo} />
  )
})
GitHub.displayName = 'GitHub'
