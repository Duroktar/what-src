import * as React from 'react'
import { Image } from 'rebass'
const url = 'https://github.githubassets.com/' +
            'images/modules/logos_page/GitHub-Logo.png'

const css = {
  width: '125px',
}

export const GitHub = React.memo(({ children }) => {
  return (
    <Image alt="github image" style={css} src={url}>
      {children}
    </Image>
  )
})
GitHub.displayName = 'GitHub'
