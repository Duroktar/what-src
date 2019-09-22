import React from 'react'

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export const Link = React.memo((props: Props) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
  />
))
Link.displayName = 'Link'
