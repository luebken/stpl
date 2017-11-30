'use strict'

const utils = require('lib/utils-http')
const myS3 = require('lib/utils-s3')

// Query and store a component in S3 /query/{ecosystem}/{package}
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
    const key = 'npms/npm/' + json.collected.metadata.name
    myS3.SaveJsonToS3(key, json).then((msg) => {
      console.log('success: SaveJsonToS3', msg)
      mainCallback()
    }).catch((err) => {
      console.log('error:', err)
      mainCallback(err)
    })
  })
}
