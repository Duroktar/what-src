import * as React from 'react'
import PropTypes from 'prop-types'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ children, ...rest }: Props) => (
  <button {...rest}>{children}</button>
)
Button.propTypes = {
  children: PropTypes.node,
}

export default Button
