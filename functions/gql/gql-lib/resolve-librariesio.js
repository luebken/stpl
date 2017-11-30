const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

module.exports.resolveLibrariesio = (context, args) => {
  ConsoleSLog('resolveLibrariesio context: ', context)
  ConsoleSLog('resolveLibrariesio args: ', args)
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'librariosio/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(librariosioData => {
    var librariosioDataBody = JSON.parse(librariosioData.Body.toString('utf-8'))
    var result = {
      metadata: {
        source: 'librariosio',
        last_modified: librariosioData.LastModified,
      },
      name: librariosioDataBody.name,
      platform: librariosioDataBody.platform,
      description: librariosioDataBody.description,
      homepage: librariosioDataBody.homepage,
      repository_url: librariosioDataBody.repository_url,
      normalized_licenses: librariosioDataBody.normalized_licenses,
      rank: librariosioDataBody.rank,
      latest_release_published_at: librariosioDataBody.latest_release_published_at,
      latest_release_number: librariosioDataBody.latest_release_number,
      keywords: librariosioDataBody.keywords
    }
    ConsoleSLog('resolveLibrariesio result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveLibrariesio:', err)
  })
}