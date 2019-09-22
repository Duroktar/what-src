import * as React from 'react'

const css = {
  width: '120px',
  marginTop: '4px',
}

export const NPM = React.memo(() => {
  return (
    <svg style={css} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 7">
      <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"/>
      <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"/>
    </svg>
  )
})
NPM.displayName = 'NPM'