import * as React from 'react'
import { CellProps } from '../../types'
import { getStyle } from '../../utils'

/* Answer: components/a/SomeCell.tsx */
export const SomeCell = React.memo(({ img, txt }: CellProps) => (
  <div className="cell" style={getStyle(img)}>{txt}</div>
))
SomeCell.displayName = 'SomeCell'
