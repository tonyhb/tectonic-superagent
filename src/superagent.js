'use strict';

import sa from 'superagent';
import { request } from './request.js';

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
const fromSuperagent = (sourceDef, query, success, fail) => {
  let {
    meta: { url, transform, method, headers }
  } = sourceDef;

  // Parse query params. Only allow query params starting with a letter so that
  // we keep ports:
  // http://localhost:8080/?id=:id1 only replaces id1.
  const params = url.match(/:([a-zA-Z](\w+)?)/g) || [];
  params.forEach(p => {
    let key = p.replace(':', '');
    url = url.replace(p, query.params[key]);
  });

  // Normalize method type
  if (method === undefined) {
    method = 'GET';
  } else {
    method = method.toUpperCase();
  }

  // Create a new request
  let r = request(method, url);
  if (headers) {
    r.set(headers);
  }

  // If there's a meta.request parameter we should use it to transform the
  // request
  if (typeof meta.request === 'function') {
    r = meta.request(r);
  }

  if (query.body) {
    r.send(query.body);
  }

  r.end((err, res) => {
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
}

export default fromSuperagent;
export { setRequest } from './request.js';
