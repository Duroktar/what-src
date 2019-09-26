const { λTry, exists } = require('@what-src/utils')
const { string, number, object } = require('yup')
const chalk = require('chalk').default
const openEditor = require('open-editor')

const shh = JSON.parse(process.env.WHAT_SRC_MIDDLEWARE_SHH || 'false') === true

const schema = object().shape({
  filename: string().required().max(512 * 2),
  line: number().required().positive().integer().max(1000 ** 2),
  column: number().required().positive().integer().max(1000 ** 2),
  basedir: string().max(512 * 2),
})

module.exports = async function whatSrcMiddleware(req, res) {
  const options = { stripUnknown: true, abortEarly: false, recursive: false }
  const [result, err] = await λTry(() => schema.validate(req.body, options))

  if (exists(err)) { return res.send(err) }

  const { filename, line, column, basedir } = result

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
  res.send({ original: result.original, msg: successMessage, targetFile })
}
