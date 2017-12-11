'use strict'

const utils = require('./lib/utils-http')
const myDDB = require('./lib/utils-ddb')

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY

// Query and store a component in DDB
// Trigger via SNS
exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  const ecosystem = msg.ecosystem
  const pkg = msg.package

  const url = 'https://libraries.io/api/' + ecosystem + '/' + encodeURIComponent(pkg) + '?api_key=' + LIBRARIES_IO_API_KEY

  utils.httpsGetJSON(url, function (err, json) {
    if (err != null) {
      console.log('error:', err)
      mainCallback(err)
    }
    const source = 'librariosio'
    const ecosystem = json.platform.toLowerCase()
    const pkg = json.name.toLowerCase()
    myDDB.PutJson(source, ecosystem, pkg, json).then((msg) => {
      console.log('success: PutJson', msg)
      mainCallback()
    }).catch((err) => {
      console.log('error:', err)
      mainCallback(err)
    })
  })
}
