const AWS = require('aws-sdk')

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

const myDDB = require('../lib/utils-ddb')

module.exports.resolveMain = (context, args) => {
  ConsoleSLog('resolveMain context: ', context)
  ConsoleSLog('resolveMain args: ', args)

  const source = 'npms'
  const ecosystem = 'npm'
  const pkg = args.name

  // main currently relies on npms
  return myDDB.GetJson(source, ecosystem, pkg).then((npmsDataBody) => {
    var result = {
      source: 'npms',
      name: npmsDataBody.collected.metadata.name,
      ecosystem: 'npm',
      description: npmsDataBody.collected.metadata.description,
      repository: npmsDataBody.collected.metadata.links.repository,
      homepage: npmsDataBody.collected.metadata.links.homepage,
      keywords: npmsDataBody.collected.metadata.keywords,
      license: npmsDataBody.collected.metadata.license
    }
    ConsoleSLog('resolveMain npms result:', result)
    return result
  }).catch(err => {
    if (err.code === 'AccessDenied') { // didn't find npms data
      ConsoleSLog('Didnt find NPMS data. Trying libraries.io')
      var params = {
        Bucket: 'stpl-data',
        Key: 'librariosio/npm/' + args.name
      }
      return myDDB.GetJson(source, ecosystem, pkg).then((libioDataBody) => {
        var result = {
          source: 'librariesio',
          name: libioDataBody.name,
          ecosystem: 'npm',
          description: libioDataBody.description,
          repository: libioDataBody.repository_url,
          homepage: libioDataBody.homepage,
          keywords: libioDataBody.keywords
        }
        ConsoleSLog('resolveMain librariesio result:', result)
        return result
      }).catch(err => {
        ConsoleSError('Err in resolveMain:', err)
      })
    } else {
      ConsoleSError('Err in resolveMain:', err)
    }
  })
}

module.exports.resolveVersioneye = (context, args) => {
  ConsoleSLog('resolveVersioneye context: ', context)
  ConsoleSLog('resolveVersioneye args: ', args)

  const source = 'versioneye'
  const ecosystem = 'npm'
  const pkg = args.name

  return myDDB.GetJson(source, ecosystem, pkg).then((versioneyeDataBody) => {
    var result = {
      metadata: {
        source: 'versioneye',
        last_modified: "todo",
      },
      name: versioneyeDataBody.name,
      language: versioneyeDataBody.language,
      description: versioneyeDataBody.description,
      version: versioneyeDataBody.version
    }
    ConsoleSLog('resolveVersioneye result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveVersioneye:', err)
  })
}

module.exports.resolveNpms = (context, args) => {
  ConsoleSLog('resolveNpms context: ', context)
  ConsoleSLog('resolveNpms args: ', args)

  const source = 'npms'
  const ecosystem = 'npm'
  const pkg = args.name

  return myDDB.GetJson(source, ecosystem, pkg).then((npmsDataBody) => {

    var dependenciesAsArray = []
    for (var property in npmsDataBody.collected.metadata.dependencies) {
      dependenciesAsArray.push({ 'name': property, 'version': npmsDataBody.collected.metadata.dependencies[property] })
    }

    var result = {
      metadata: {
        source: 'npms',
        last_modified: "TODO npmsData.LastModified",
      },
      collected: {
        metadata: {
          name: npmsDataBody.collected.metadata.name,
          description: npmsDataBody.collected.metadata.description,
          version: npmsDataBody.collected.metadata.version,
          keywords: npmsDataBody.collected.metadata.keywords,
          links: {
            homepage: npmsDataBody.collected.metadata.links.homepage,
            repository: npmsDataBody.collected.metadata.links.repository
          },
          license: npmsDataBody.collected.metadata.license,
          dependencies: dependenciesAsArray
        }
      },
      evaluation: {
        quality: {
          carefulness: npmsDataBody.evaluation.quality.carefulness,
          tests: npmsDataBody.evaluation.quality.tests,
          health: npmsDataBody.evaluation.quality.health,
          branding: npmsDataBody.evaluation.quality.branding
        }
      }
    }
    ConsoleSLog('resolveNpms result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveNpms:', err)
  })
}

module.exports.resolveSnyk = (context, args) => {
  ConsoleSLog('resolveSnyk context: ', context)('resolveSnyk args: ', args)
  const source = 'snyk'
  const ecosystem = 'npm'
  const pkg = args.name

  return myDDB.GetJson(source, ecosystem, pkg).then((snykDataBody) => {
    var result = {
      metadata: {
        source: 'snyk',
        last_modified: "TODO snykData.LastModified",
      },
      readme: snykDataBody.readme
    }
    ConsoleSLog('resolveSnyk result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveSnyk:', err)
  })
}

module.exports.resolveDaviddm = (context, args) => {
  ConsoleSLog('resolveDaviddm context: ', context)('resolveDaviddm args: ', args)

  const source = 'daviddm'
  const ecosystem = 'npm'
  const pkg = args.name

  return myDDB.GetJson(source, ecosystem, pkg).then((daviddmBody) => {

    var result = {
      metadata: {
        source: 'daviddm',
        last_modified: 'TODO daviddmData.LastModified',
      },
      status: daviddmBody.status,
      deps: daviddmBody.deps
    }
    ConsoleSLog('resolveDaviddm result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveDaviddm:', err)
  })
}
