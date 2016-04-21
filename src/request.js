'use strict';

import sa from 'superagent';

// By default the function to generate a superagent request just initiates
// a bare request.
let create = (method, url) => sa(method, url);

const request = (method, url) => create(method, url)

// setRequest allows users to override the default superagent instantiation with
// a custom implementation.
//
// This allows users to set app-wide headers, for example.
const setRequest = (func) => {
  create = func;
};

export {
  request,
  setRequest
};
