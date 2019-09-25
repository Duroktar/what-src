import * as React from 'react'

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

export const Toast = React.memo((props: Props) => (
  <div className="toast">
    <img alt="toast" {...props}></img>
  </div>
))
