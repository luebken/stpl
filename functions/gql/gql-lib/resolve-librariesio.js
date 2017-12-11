const AWS = require('aws-sdk')

const log = require('../lib/utils-log')

const myDDB = require('../lib/utils-ddb')

const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

module.exports.resolveLibrariesio = (context, args) => {
  ConsoleSLog('resolveLibrariesio context: ', context)
  ConsoleSLog('resolveLibrariesio args: ', args)

  const source = 'librariosio'
  const ecosystem = 'npm'
  const pkg = args.name

  return myDDB.GetJson(source, ecosystem, pkg).then((librariosioDataBody) => {
    ConsoleSLog('resolveLibrariesio GetJson:', librariosioDataBody)

    var result = {
      metadata: {
        source: 'librariosio',
        last_modified: 'TBD',
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