'use strict'

const G = require('graphql')
const schema = require('./gql-lib/schema')
const sns = require('./lib/utils-sns')
const l = require('./lib/utils-log')

function runQuery(query, claims, variables) {
  return G.graphql(schema.Schema, query, { claims: claims }, null, variables)
}

module.exports.handle = (event, context, cb) => {
  l.ConsoleSLog('Received SNS event', event)
  var userInfo = {}
  if (event.requestContext && event.requestContext.authorizer) {
    userInfo = event.requestContext.authorizer.claims
  }

  const request = JSON.parse(event.body)

  return runQuery(request.query, userInfo, request.variables)
    .then(response => {
      // TODO differentiate: missing / updated
      // TODO ensure main is always present
      var repository = response.data.main ? response.data.main.repository : ''
      sns.publishMissingComponentEvent(request.variables.ecosystem, request.variables.name, repository)

      l.ConsoleSLog('Query finished. Response.', response)

      var result = {
        statusCode: 0, // TBD below
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: '' // TBD below
      }
      if (response.errors && response.errors.length > 0) {
        result.statusCode = 500
        response.data.status = 500
        result.body = JSON.stringify(response.errors)
      } else { // no errors
        // if at least one data is present return
        //TODO try fill .main from different providers and check of that is present 
        if (response.data.librariesio != null | response.data.versioneye != null | response.data.npms != null) {
          result.statusCode = 200
          response.data.status = 200
          result.body = JSON.stringify(response.data)
        } else {
          result.statusCode = 404
          response.data.status = 404
          result.body = JSON.stringify(response.data)
        }
      }
      return result
    })
    .then(response => {
      l.ConsoleSLog('runQuery response', response)
      cb(null, response)
    })
    .catch(err => {
      l.ConsoleSLog('err after runQuery ', err)
      cb(err)
    })
}
