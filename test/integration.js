var co = require('co'),
  path = require('path'),
  request = require('supertest'),
  shell = require('shelljs'),
  waigo = require('waigo');

var _utils = require('waigo-test-utils')(module),
  test = _utils.test,
  utils = _utils.utils,
  assert = utils.assert,
  expect = utils.expect,
  should = utils.should;


test['url slash seo'] = {
  beforeEach: function(done) {
    var self = this;

    shell.cp('-Rf', path.join(__dirname, '/../src/support'), utils.appFolder);

    co(function*() {
      yield* waigo.init({
        appFolder: utils.appFolder
      });

      self.Application = waigo.load('application');
      self.app = self.Application.app;
    })(done);
  },

  afterEach: function(done) {    
    utils.spawn(this.Application.shutdown)
      .then(function() {
        shell.rm('-rf', path.join(utils.appFolder, 'support'));
      })
      .nodeify(done);
  },

  'default (without slash, permanent redirect)': {
    'correct': function(done) {
      var self = this;

      co(function*(){
        yield* self.Application.start();
      })(function(err) {
        if (err) return done(err);

        self.request = request(self.app.config.baseURL);

        self.request.get('/test')
          .expect(200)
          .end(done);
      });      
    },
    'incorrect': function(done) {
      var self = this;

      co(function*(){
        yield* self.Application.start();
      })(function(err) {
        if (err) return done(err);

        self.request = request(self.app.config.baseURL);

        self.request.get('/test/')
          .expect(301)
          .expect('Location', '/test')
          .end(done);
      });      
    }
  },


  'with slash, temporary redirect': {
    beforeEach: function(done) {
      var self = this;

      co(function*(){
        yield* self.Application.start({
          postConfig: function(config) {
            config.middleware.options.urlSlashSeo = {
              withSlash: true,
              permRedirect: false
            }
          }          
        });
      })(done);
    },
    'correct': function(done) {
      var self = this;

      self.request = request(self.app.config.baseURL);

      self.request.get('/test/')
        .expect(200)
        .end(done);
    },
    'incorrect': function(done) {
      var self = this;

      self.request = request(self.app.config.baseURL);

      self.request.get('/test')
        .expect(302)
        .expect('Location', '/test/')
        .end(done);
    }
  },

};

