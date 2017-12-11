
const AWS = require('aws-sdk')

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.PutJson = (source, ecosystem, pkg, json) => new Promise((resolve, reject) => {

  //SourceEcosystemPackage
  json.sep = source + "/" + ecosystem + "/" + pkg
  ConsoleSLog('Puting JSON for SEP key: ', json.sep)
  var params = {
    TableName: 'stpl-data',
    Item: json
  };

  docClient.put(params, function (err, data) {
    if (err) {
      ConsoleSError('Error from docClient.put: ', err, data)
      reject(err)
    } else {
      ConsoleSLog('Data from docClient.put: ', data)
      resolve('Data stored in Dynamo')
    }
  });
})

module.exports.GetJson = (source, ecosystem, pkg) => new Promise((resolve, reject) => {
  const key = source + "/" + ecosystem + "/" + pkg
  ConsoleSLog('Getting JSON for SEP key: ', key)

  var params = {
    TableName: 'stpl-data',
    Key: {
      "sep": key
    }
  };

  docClient.get(params, function (err, data) {
    if (err) {
      ConsoleSError('Error from docClient.get: ', err, data)
      reject(err)
    } else {
      ConsoleSLog('Got data from docClient.get: ', data)
      resolve(data.Item)
    }
  });
})


