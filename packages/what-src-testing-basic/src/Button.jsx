import * as React from 'react'

const Button = ({ children, ...rest }) => (
  <button {...rest}>{children}</button>
)
Button.propTypes = {
  children: React.Children.only,
}

export default Button
