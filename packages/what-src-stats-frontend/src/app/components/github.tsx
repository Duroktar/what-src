import * as React from 'react'
import { Image } from 'rebass'
const url = 'https://github.githubassets.com/' +
            'images/modules/logos_page/GitHub-Logo.png'

const css = {
  width: '125px',
}

export const GitHub = React.memo(() => {
  return (
    <Image style={css} src={url} />
  )
})
GitHub.displayName = 'GitHub'
