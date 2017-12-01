'use strict'

const utils = require('./lib/utils-http')
const myS3 = require('./lib/utils-s3')

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY

// Query and store a component in S3 /query/{ecosystem}/{package}
// Trigger via SNS
const iopipe = require('iopipe')();

exports.handle = iopipe((event, context, mainCallback) => {
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
    const key = 'librariosio/' + json.platform.toLowerCase() + '/' + json.name.toLowerCase()
    myS3.SaveJsonToS3(key, json).then((msg) => {
      console.log('success: SaveJsonToS3', msg)
      mainCallback()
    }).catch((err) => {
      console.log('error:', err)
      mainCallback(err)
    })
  })
})
