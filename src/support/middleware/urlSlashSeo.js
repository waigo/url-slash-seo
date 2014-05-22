"use strict";


var _ = require('lodash'),
  debug = require('debug')('waigo-url-slash-seo');


/**
 * # Middleware: URL Slash SEO
 *
 * This enhances your SEO by auto-redirecting the client to the correct version 
 * of a URL with or without an ending slash when the incorrect version is 
 * accessed.
 *
 * If using this middleware then ensure you write your routes according to 
 * your chosen rule, i.e. with or without ending slashes.
 *
 * Note that this middleware only works for GET and HEAD requests.
 */


/**
 * Build.
 *
 * @param {Object} options Configuration options.
 * @param {String} [options.withSlash] If true then it is assumed that correct URLs end in slashes. If false (default) then they are assumed to not.
 * @param {String} [options.permRedirect] If true (default) then a HTTP 301 status code will be issued with redirect. Otherwise HTTP 302.
 * 
 * @return {Function} middleware
 */
module.exports = function(options) {
  options = _.extend({
    withSlash: false,
    permRedirect: true
  }, options);

  var statusCode = options.permRedirect ? 301 : 302;

  return function*(next) {
    var urlPath = this.request.path,
      shouldRedirect = false;

    // only applies to GET/HEAD requests and non-root URL
    if ('/' === urlPath || ('GET' != this.request.method 
        && 'HEAD' != this.request.method) ) {
      yield next;
      return;
    }

    // should have slash
    if (options.withSlash) {
      // but doesn't
      if ('/' !== urlPath.charAt(urlPath.length - 1)) {
        urlPath += '/';
        shouldRedirect = true;
      }
    }
    // should'nt have slash
    else {
      // but does
      if ('/' === urlPath.charAt(urlPath.length - 1)) {
        urlPath = urlPath.substr(0, urlPath.length-1);
        shouldRedirect = true;
      }
    }

    if (shouldRedirect) {
      debug('Redirecting to ' + urlPath + ' (HTTP ' + statusCode + ')');
      
      this.response.status = statusCode;
      this.response.redirect(urlPath);
    } else {
      yield next;
    }
  };
};
