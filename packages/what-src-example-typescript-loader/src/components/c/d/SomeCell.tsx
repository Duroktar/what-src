import * as React from 'react'
import { getStyle } from '../../../utils'
import { CellProps } from '../../../types'

export const SomeCell = React.memo(({ img, txt }: CellProps) => (
  <div className="cell" style={getStyle(img)}>{txt}</div>
))

SomeCell.displayName = 'SomeCell'
