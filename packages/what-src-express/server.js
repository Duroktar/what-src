const chalk = require('chalk').default
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

if (!process.env.EDITOR) {
  Object.defineProperty(process.env, 'EDITOR', { value: 'vscode' })
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

const port = process.env.WHAT_SRC_DAEMON_PORT || 8018
const endpoint = process.env.WHAT_SRC_DAEMON_ENDPOINT || '__what_src'

app.post('/' + endpoint, require('@what-src/express-middleware'))

app.listen(port, () => {
  if (!process.env.WHAT_SRC_DAEMON_SHH) {
    console.log(
      chalk.gray('[@what-src/express]'),
      'Listening on port',
      chalk.cyanBright.bold(port),
    )
  }
})
