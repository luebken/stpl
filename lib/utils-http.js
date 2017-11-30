const https = require('https')

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

module.exports.httpsGetJSON = (url, callback) => {
  ConsoleSLog('httpsGetJSON url:', url)

  https.get(url, (response) => {
    const statusCode = response.statusCode
    const contentType = response.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`)
    }
    if (error) {
      ConsoleSError('Error for https.get', error)
      response.resume()
      return
    }

    response.setEncoding('utf8')
    let rawData = ''
    response.on('data', function (chunk) { rawData += chunk })
    response.on('end', () => {
      let parsedData
      try {
        parsedData = JSON.parse(rawData)
      } catch (e) {
        ConsoleSError('Error for https.get', {err: 'error parsing', rawData: 'rawData', message: e.message})
      }
      callback(null, parsedData)
    })
  }).on('error', (e) => {
    ConsoleSError(`Got error: ${e.message}`, e)
  })
}
