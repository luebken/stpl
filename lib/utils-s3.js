
const AWS = require('aws-sdk')

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

module.exports.SaveJsonToS3 = (key, json) => new Promise((resolve, reject) => {
  const s3 = new AWS.S3()

  var buf = new Buffer.from(JSON.stringify(json))

  var params = {
    Bucket: 'stpl-data',
    Key: key,
    ContentType: 'application/json',
    ACL: 'public-read',
    Body: buf
  }

  s3.putObject(params, function (err, data) {
    if (err) {
      ConsoleSError('Error from s3.putObject: ', err, data)
      // callback(err, 'Error')
      reject(err)
    } else {
      ConsoleSLog('Data from s3.putObject: ', data)
      // callback(null, 'Data stored in S3')
      resolve('Data stored in S3')
    }
  })
})
