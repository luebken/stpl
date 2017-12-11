'use strict'

const utils = require('lib/utils-http')
const myDDB = require('./lib/utils-ddb')

// Query and store a component /query/{ecosystem}/{package}
// Trigger via SNS
exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  // TODO ignore if ecosystem != nodejs
  // const ecosystem = msg.ecosystem
  const pkg = msg.package

  const url = 'https://api.npms.io/v2/package/' + encodeURIComponent(pkg)

  utils.httpsGetJSON(url, function (err, json) {
    if (err != null) {
      console.log('error:', err)
      mainCallback(err)
    }
    const source = 'npms'
    const ecosystem = 'npm'
    const pkg = json.collected.metadata.name

    myDDB.PutJson(source, ecosystem, pkg, json).then((msg) => {
      console.log('success: PutJson', msg)
      mainCallback()
    }).catch((err) => {
      console.log('error:', err)
      mainCallback(err)
    })
  })
}
