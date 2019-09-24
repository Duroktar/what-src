import * as React from 'react'

type Props = {
  down: boolean
}

export const Arrow = React.memo((props: Props) => {
  const state = React.useMemo(
    () => props.down ? 'down' : 'up', [props.down])
  return (
    <div id="arrow-wrapper" className={state}>
      <div className="arrow-border">
        <div className={`arrow ${state}`}></div>
        <div className='pulse'></div>
      </div>
    </div>
  )
})

Arrow.displayName = 'Arrow'
