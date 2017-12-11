'use strict'

const AWS = require('aws-sdk')
const myDDB = require('./lib/utils-ddb')

exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  const ecosystem = msg.ecosystem
  const pkg = msg.package

  const s3 = new AWS.S3()
  var params = {
    Bucket: 'vulnerabilitydb',
    Prefix: ecosystem + '/' + pkg + '/'
  }
  // https://snyk.io/vuln/npm:caolilinode
  s3.listObjects(params, function (err, data) {
    if (err) {
      console.error('err from s3.listObjects ', err)
    }
    console.log('data from s3.listObjects ', data)

    if (data.Contents.length > 0) {
      console.log('Snyk entry found for ', ecosystem, pkg)
      var params = {
        Bucket: 'vulnerabilitydb',
        Key: data.Contents[0].Key // TODO check all
      }
      s3.getObject(params, function (err, data) {
        if (err) {
          console.error('err from s3.getObject ', err)
        }

        //        let dataBody = data.Body.toString('utf-8')
        console.log('data from s3.getObject ', data)
        var json = {
          readme: data.Body.toString('utf-8')
        }
        const source = 'snyk'
        myDDB.PutJson(source, ecosystem, pkg, json).then((msg) => {
          console.log('success: PutJson', msg)
          mainCallback()
        }).catch((err) => {
          console.log('error:', err)
          mainCallback(err)
        })
      })
    } else {
      console.log('No Snyk entry found for ', ecosystem, pkg)
    }
  })
}
