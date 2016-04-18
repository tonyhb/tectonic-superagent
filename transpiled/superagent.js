'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * fromSuperagent is a driver for using superagent with Tectonic.
 *
 * Query parameters will be added to the request automatically.
 *
 * Usage:
 *
 * manager.fromSuperagent([
 *   {
 *     params: ['id'],
 *     meta: {
 *       url: '/api/v0/users/:id',
 *       // use this to transform API responses
 *       transform: (data) => data,
 *       // this function accepts a superagent request to modify
 *       request: (r) => r
 *         .set('X-API-Key', 'foobar')
 *         .set('Accept', 'application/json'),
 *   }
 * ])
 */
var fromSuperagent = function fromSuperagent(sourceDef, query, success, fail) {
  var _sourceDef$meta = sourceDef.meta;
  var url = _sourceDef$meta.url;
  var transform = _sourceDef$meta.transform;
  var request = _sourceDef$meta.request;

  // Parse query params

  var params = url.match(/:\w+/g);
  params.forEach(function (p) {
    var key = p.replace(':', '');
    url = url.replace(p, query.params[key]);
  });

  // TODO: Add query parameters to URL

  // If we have modifications to the request from the sourcedefinition we should
  // apply them here.
  if (request) {
    request = request(_superagent2.default.get(url));
  } else {
    request = _superagent2.default.get(url);
  }

  request.end(function (err, res) {
    // If this errored call fail
    if (err !== null) {
      console.warn('Error with superagent request: ', err);
      return fail(err);
    }

    if (sourceDef.meta.transform) {
      return success(sourceDef.transform(res.body));
    }

    return success(res.body);
  });
};

exports.default = fromSuperagent;