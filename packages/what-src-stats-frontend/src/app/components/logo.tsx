import * as React from 'react'
import { Image } from 'rebass'

const style = `
  -webkit-user-select: none;
  margin: auto;
  transform: scale(0.75);
`

export const Logo = React.memo(() => {
  return (
    <Image
      alt="what-src logo"
      src="https://raw.githubusercontent.com/Duroktar/what-src-logo/master/what-src.png"
      css={style}
    />
  )
})
Logo.displayName = 'Logo'
