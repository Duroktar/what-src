import * as React from 'react'
import ReactTooltip from 'react-tooltip'

type InfoProps = {
  txt: string
}

export const Info = React.memo((props: InfoProps) => {
  return (
    <>
      <ReactTooltip offset={{ top: 12 }} />
      <i data-tip={props.txt} className="info-circle" />
    </>
  )
})

Info.displayName = 'Info'
