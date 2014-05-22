[![Build Status](https://secure.travis-ci.org/waigo/url-slash-seo.png)](http://travis-ci.org/waigo/url-slash-seo)

This [waigo](http://waigojs.com) plugin provides:

**urlSlashSeo**

This middleware enhances your SEO by auto-redirecting the client 
to the correct version of a URL with or without an ending slash when the 
incorrect version is accessed.

If using this middleware then ensure you write your routes according to 
your chosen rule, i.e. with or without ending slashes.

Note that this middleware only works for `GET` and `HEAD` requests.


## Installation

```bash
$ npm install waigo-url-slash-seo
```

## Example

In your configuration file enable it as common middleware:

```javascript
config.middleware.order = [
  'errorHandler',
  'staticResources',
  'urlSlashSeo',  // check now, before any more work is done
  'sessions',
  'outputFormats'
];

config.middleware.options.urlSlashSeo = {
  /* If false then correct URLs don't have a trailing slash. If true they do. */
  withSlash: false,
  /* If true then redirect with status code 301, else use 302 */
  permRedirect: true
};
```

## License

MIT - see LICENSE.md