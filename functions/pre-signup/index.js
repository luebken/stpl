console.log('starting function')

const sns = require('./lib/utils-sns')

exports.handle = function (e, ctx, cb) {
  console.log('processing event:', e)
  sns.publishUserSignupEvent()
  // e.response.autoConfirmUser = true
  return cb(null, e)
}
