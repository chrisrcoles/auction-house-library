'use strict';
/*
* Helper method that wraps error replies
*
* @param {Function} reply
* @param {String}   message
* @param {String}   type
* @param {Integer}  code
*
* */
module.exports.replyError = function (reply, message, type, code) {
  let obj = {};
  if (!code) code = 400;
  if (!obj.error) obj.error = {};

  obj.error.msg = message || 'An error has occurred';
  obj.error.type = type || 'DEFAULT_ERR_TYPE';
  obj.error.statusCode = code;

  return reply(obj, null).code(code)
};

/*
 * Helper method that wraps success replies
 *
 * @param {Function} reply
 * @param {Object}   data
 * @param {Integer}  code
 * @param {String}   message
 *
 *
 * */
module.exports.replySuccess = function (reply, data, code, msg) {
  let obj = {};
  let statusCode = code ? code : 200;
  if (data) obj.data = data;
  if (msg) obj.msg = msg;

  return reply(null, obj).code(statusCode)
};

