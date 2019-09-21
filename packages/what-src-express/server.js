const chalk = require('chalk').default
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const host = process.env.WHAT_SRC_DAEMON_HOST || 'localhost'
const port = process.env.WHAT_SRC_DAEMON_PORT || 8018
const endpoint = process.env.WHAT_SRC_DAEMON_ENDPOINT || '__what_src'
const shh = JSON.parse(process.env.WHAT_SRC_DAEMON_SHH || 'false') === true
const editor = process.env.WHAT_SRC_DAEMON_EDITOR || 'vscode'

if (!process.env.EDITOR) {
  Object.defineProperty(process.env, 'EDITOR', { value: editor })
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

app.post('/' + endpoint, require('@what-src/express-middleware'))

app.listen({ port, host }, () => {
  if (!shh) {
    console.log(
      chalk.gray('[@what-src/express]'),
      'Listening on',
      chalk.cyanBright.bold('http://' + host + ':' + port + '/' + endpoint),
    )
  }
})
