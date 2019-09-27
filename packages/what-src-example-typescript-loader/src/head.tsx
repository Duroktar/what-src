import * as React from 'react'
import Helmet from 'react-helmet'

const defaultDescription = 'what-src-example-typescript-loader webpage.'

type HeadProps = {
  title?: string
  description?: string
  url?: string
}

const Head = React.memo((props: HeadProps) => (
  <Helmet>
    <meta charSet="UTF-8" />
    <title>{props.title || 'typescript-loader example'}</title>
    <meta
      name="description"
      content={props.description || defaultDescription}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </Helmet>
))
Head.displayName = 'Head'

export default Head
