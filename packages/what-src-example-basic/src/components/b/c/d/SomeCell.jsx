import * as React from 'react'
import PropTypes from 'prop-types'
import { getStyle } from '../../../../utils'

export const SomeCell = React.memo(({ img, txt }) => (
  <div className="cell" style={getStyle(img)}>{txt}</div>
))

SomeCell.displayName = 'SomeCell'

SomeCell.propTypes = {
  img: PropTypes.string,
  txt: PropTypes.node,
}
