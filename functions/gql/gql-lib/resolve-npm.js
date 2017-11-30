const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

module.exports.resolveNpm = (context, args) => {
  ConsoleSLog('resolveNpm context: ', context)
  ConsoleSLog('resolveNpm args: ', args)
  const pkg = args.name
  var params = {
    Bucket: 'stpl-data',
    Key: 'npm/npm/' + pkg
  }
  return s3.getObject(params).promise().then(npmData => {
    var body = JSON.parse(npmData.Body.toString('utf-8'))
    var object = body.objects[0]
    
    var result = {
      metadata: {
        source: 'npm',
        last_modified: npmData.LastModified,
      },
      name: object.package.name,
      score: {
        final: object.score.final,
        quality: object.score.detail.quality,
        popularity: object.score.detail.popularity,
        maintenance: object.score.detail.maintenance
      }
    }
    ConsoleSLog('resolveLibrariesio result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveLibrariesio:', err)
  })
}