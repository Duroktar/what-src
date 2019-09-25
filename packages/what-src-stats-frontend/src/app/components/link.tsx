import React from 'react'

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export const Link = React.memo(({ children, ...props }: Props) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
  >{children}</a>
))
Link.displayName = 'Link'
