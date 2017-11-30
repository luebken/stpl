/**
 * @description Structured logging of a JSON
 * @param {string} origin Giving some context on the origin of this log.
 * @param {*} json The JSON payload to be logged.
 */
module.exports.ConsoleSLog = function ConsoleSLog (origin, ...json) {
  var event = {}
  event.logOrigin = origin
  event.json = json
  console.log(JSON.stringify(event))
  return ConsoleSLog
}

/**
 * @description Structured logging of a JSON as an error
 * @param {string} origin Giving some context on the origin of this log.
 * @param {*} json The JSON payload to be logged.
 */
module.exports.ConsoleSError = function ConsoleSError (origin, ...error) {
  var event = {}
  event.logOrigin = origin
  event.error = error
  console.log(JSON.stringify(event))
  return ConsoleSError
}
