
export const basicComponents = `
import * as React from 'react'

class TestClassComponent extends React.Component {
  render() {
    return (
      <div className="class-component">
        <p>some p thing</p>
      </div>
    )
  }
}

const TestFunctionalComponent = () => (
  <div className="functional-component">
    <p>some p thing</p>
  </div>
)

const TestMemoizedComponent = React.memo(() => (
  <div className="memoized-component">
    <p>some p thing</p>
  </div>
))

const TestFragment = () => (
  <Fragment>
    <p>some p thing</p>
  </Fragment>
)

const TestReactDotFragment = () => (
  <React.Fragment>
    <p>some p thing</p>
  </React.Fragment>
)

const TestEmptyFragment = () => (
  <>
    <p>some p thing</p>
  </>
)
`
