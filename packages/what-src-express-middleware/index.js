const { λTry, exists } = require('@what-src/utils')
const { string, number, object } = require('yup')
const chalk = require('chalk').default
const openEditor = require('open-editor')

const shh = JSON.parse(process.env.WHAT_SRC_MIDDLEWARE_SHH || 'false') === true

const schema = object().shape({
  filename: string().required().max(512 * 2),
  line: number().required().positive().integer().max(1000 ** 2),
  column: number().required().positive().integer().max(1000 ** 2),
  basedir: string().max(512 * 2).default(''),
})

module.exports = async function whatSrcMiddleware(req, res) {
  const options = { stripUnknown: true, abortEarly: false }
  const success = await λTry(() => schema.validate(req.body, options))

  if (exists(success.data)) {
    const { filename, line, column, basedir } = success.data

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
    return res.send({ original: req.body, msg: successMessage, targetFile })
  }
  res.send(success.err)
}
