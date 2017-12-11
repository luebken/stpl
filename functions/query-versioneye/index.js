'use strict'

const myHttp = require('lib/utils-http')
const myDDB = require('./lib/utils-ddb')

const VERSIONEYE_API_KEY = process.env.VERSIONEYE_API_KEY

// Query and store a component in S3 /query/{ecosystem}/{package}
// Trigger via SNS
exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  let ecosystem = msg.ecosystem
  const pkg = msg.package

  // versioneye specific mapping
  let product
  if (ecosystem === 'npm') {
    product = 'nodejs'
  } else {
    product = ecosystem
  }

  const url = 'https://www.versioneye.com/api/v2/products/' + product + '/' + encodeURIComponent(pkg) + '?api_key=' + VERSIONEYE_API_KEY

  myHttp.httpsGetJSON(url, function (err, json) {
    if (err != null) {
      console.log('error httpsGetJSON:', err)
      context.fail(err)
      mainCallback(err)
    }
    const source = 'versioneye'
    myDDB.PutJson(source, ecosystem, pkg, json).then((msg) => {
      console.log('success: PutJson', msg)
      mainCallback()
    }).catch((err) => {
      console.log('error:', err)
      mainCallback(err)
    })
  })
}
