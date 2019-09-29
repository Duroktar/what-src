import * as babel from '@babel/core'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'
import WhatSrcPlugin from '../index'

const example = `
import * as React from 'react'
import ReactDOM from 'react-dom'

import Helmet from './Helmet.jsx'
import Button from './Button.jsx'

class App extends React.Component {
  render() {
    return (
      <div className="first">
        <Helmet>
          <meta charset="utf-8"></meta>
        </Helmet>
        <p>some p thing</p>
        <br />
        <div id="hat">
          <h1>Header</h1>
          <article>
            Some article..

            More texxt and stuffz
          </article>
          <article>
            A Second article!!

            With even more texxt and stuffz!!!!!!!!
          </article>
        </div>
        <React.Fragment>
          <div>inside</div>
          <div>fragment</div>
        </React.Fragment>
        <div>
          <label htmlFor="but">And</label>
          <Button id="but">Buttons!</Button>
        </div>
        <a href="http://google.com">And links too :D</a>
        <footer>
          The ol&apos; footer
        </footer>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
`

const configuration: WhatSrcPluginOptions = {
  useRemote: true,
}

it('works', () => {
  const res = babel.transformSync(example, {
    plugins: [[WhatSrcPlugin, configuration]],
    filename: 'dontmatter.ts',
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
  })
  expect(res!.code).toMatchSnapshot()
})
