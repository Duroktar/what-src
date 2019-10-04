import * as React from 'react'
import ReactDOM from 'react-dom'
import sample from 'lodash.sample'
import waldo1 from './assets/waldo-1.jpeg'
import waldo2 from './assets/waldo-2.jpeg'
import waldo3 from './assets/waldo-3.jpeg'
// r/programminghorror
import { SomeCell as SomeCell1 } from './components/a/SomeCell'
import { SomeCell as SomeCell2 } from './components/b/c/d/SomeCell'
import { SomeCell as SomeCell3 } from './components/b/c/d/e/f/g/SomeCell'
import { SomeCell as SomeCell4 } from './components/b/c/e/SomeCell'
import { SomeCell as SomeCell5 } from './components/c/d/SomeCell'
import './style.css'

const components = [
  SomeCell1,
  SomeCell2,
  SomeCell3,
  SomeCell4,
  SomeCell5,
]

const images = [
  waldo1,
  waldo2,
  waldo3,
]

export const strings = [
  'Find me!',
  'Where am I?',
  'Where could I be?',
  'Can you find me??',
]

class App extends React.Component {
  generateCells(n: number) {
    const nodes: React.ReactNode[] = []
    for (let i = 0; i < n; i++) {
      const Component = sample(components)
      const img = sample(images)
      const txt = sample(strings)
      const child = <Component img={img} txt={<p>{txt}</p>} />
      const article = <article key={i}>{child}</article>
      nodes.push(article)
    }
    return nodes
  }

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>Can you find the source file?</h1>
        </header>
        <main>
          {this.generateCells(12)}
        </main>
        <footer>
          <p>Created by Duroktar</p>
        </footer>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
