const AWS = require('aws-sdk')

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

const myDDB = require('../lib/utils-ddb')

module.exports.resolveNpm = (context, args) => {
  ConsoleSLog('resolveNpm context: ', context)
  ConsoleSLog('resolveNpm args: ', args)

  const source = 'npm'
  const ecosystem = 'npm'
  const pkg = args.name

  return myDDB.GetJson(source, ecosystem, pkg).then((npmData) => {
    var object = npmData.objects[0]

    var result = {
      metadata: {
        source: 'npm',
        last_modified: 'TODO',
      },
      name: object.package.name,
      score: {
        final: object.score.final,
        quality: object.score.detail.quality,
        popularity: object.score.detail.popularity,
        maintenance: object.score.detail.maintenance
      }
    }
    ConsoleSLog('resolveNPM result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveNPM:', err)
  })
}