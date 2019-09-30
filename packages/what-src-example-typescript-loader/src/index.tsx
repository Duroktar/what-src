import * as React from 'react'
import ReactDOM from 'react-dom'
import Head from './head'
import Button from './Button'

class App extends React.Component {
  render() {
    return (
      <div className="first">
        <Head />
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
        <div>
          <label htmlFor="but">And</label>
          <Button id="but">Buttons!</Button>
        </div>
        <a href="http://google.com">And links too :D</a>
        <React.Fragment>
          <div>inside</div>
          <div>fragment</div>
        </React.Fragment>
        <footer>
          The ol&apos; footer
        </footer>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
