console.log('starting function')
exports.handle = function (event, context, callback) {
  console.log('processing event:', event)
  console.log('with context:', context)

  var response = {
    //message1: `Welcome ${e.requestContext.authorizer.claims.name} to Stpl API`,
    message2: `Welcome to Stpl API`,
    version: 'pre-alpha',
    event: event
  }

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  })
}
