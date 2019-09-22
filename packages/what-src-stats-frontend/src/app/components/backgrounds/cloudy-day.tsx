import * as React from 'react'

type BgProps = {
  children: any;
}

export const CloudyDayBackground = ({ children }: BgProps) => {
  return (
    <div id="clouds" className="background">
      <div className="cloud x1"></div>
      <div className="cloud x2"></div>
      <div className="cloud x3"></div>
      <div className="cloud x4"></div>
      <div className="cloud x5"></div>
      {children}
    </div>
  )
}
