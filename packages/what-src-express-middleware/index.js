const chalk = require('chalk').default
const openEditor = require('open-editor')

const isNullOrUndefined = v => v === null || v === undefined

module.exports = function whatSrcMiddleware(req, res) {
  /** @type {{filename: string; line: string; column: string}} */
  const { filename, line, column, basedir } = req.body
  const shh = JSON.parse(process.env.WHAT_SRC_MIDDLEWARE_SHH || 'false') === true

  // validation. failure in any case short-circuits the entire operation
  if (~[filename, line, column, basedir].findIndex(isNullOrUndefined)) {
    const errorMessage = { error: { filename, line, column, basedir }, msg: 'missing fields' }
    if (!shh) console.log(JSON.stringify(errorMessage))
    return res.send(errorMessage)
  }
  if (basedir.length === 0 || filename.length === 0 || !Number.isInteger(line) || !Number.isInteger(line)) {
    const errorMessage = { error: { filename, line, column, basedir }, msg: 'invalid field types' }
    if (!shh) console.error(JSON.stringify(errorMessage))
    return res.send(errorMessage)
  }

  // validation passed so we'll log the request and open the file
  const targetFile = `${basedir}${filename}:${line}:${column}`
  if (!shh) {
    console.log(
      chalk.cyanBright('Opening'),
      chalk.whiteBright.bold(targetFile),
      'in',
      chalk.black.bgGreen(process.env.EDITOR)
    )
  }

  openEditor([targetFile])

  const successMessage = `Opened "${targetFile}" in '${process.env.EDITOR}'`
  res.send({ success: { filename, line, column, basedir }, msg: successMessage, value: targetFile })
}
