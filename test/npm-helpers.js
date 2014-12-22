

var fs = require('fs-extra');
var pathExtra = require('path-extra');
var assert = require('assert');

var fixturesDir = pathExtra.join( __dirname, 'fixtures');
var workingDir = pathExtra.join( __dirname, '.test-working_dir');
var cozyHOME = pathExtra.join(workingDir, '.cozy-light' );

var cozyKernel = require('../lib/cozy-kernel');
cozyKernel.setHome(cozyHOME);
var configHelpers = cozyKernel.configHelpers;
var npmHelpers = require('../lib/npm-helpers')(cozyKernel);


describe('NPM Helpers', function () {


  describe('install', function () {

    before(function(){
      fs.removeSync(workingDir);
      fs.mkdirSync(workingDir);
      fs.mkdirSync(cozyHOME);
      process.chdir(cozyHOME);
    });

    after(function(){
      try {
        fs.removeSync(workingDir);
      } catch(err) {
        console.log(err);
      }
    });

    it('should install a module.', function (done) {
      this.timeout(60000);
      var destPath = configHelpers.modulePath('hello');
      npmHelpers.install('cozy-labs/hello', function (err) {
        assert.equal(err, null, 'Cannot install module.');
        assert(fs.existsSync(destPath),
          'Module is not installed in the cozy-light folder.');
        done();
      });
    });
    it('should link a module.', function (done) {
      var testapp = pathExtra.join(fixturesDir, 'test-app');
      var destPath = configHelpers.modulePath('hello');
      npmHelpers.link(testapp, function (err) {
        assert.equal(err, null, 'Cannot link module.');
        assert(fs.existsSync(destPath),
          'Module is not linked in the cozy-light folder.');
        done();
      });
    });
  });

  describe('uninstall', function(){

    before(function(){
      fs.removeSync(workingDir);
      fs.mkdirSync(workingDir);
      fs.mkdirSync(cozyHOME);
      process.chdir(cozyHOME);
    });

    after(function(){
      try {
        fs.removeSync(workingDir);
      } catch(err) {
        console.log(err);
      }
    });

    it('should remove a remote module.', function (done) {
      this.timeout(60000);
      var destPath = configHelpers.modulePath('hello');
      var srcModule = 'cozy-labs/hello';
      process.chdir(cozyHOME);
      npmHelpers.install(srcModule, function (err) {
        assert.equal(err, null, 'Cannot install module.');
        assert(fs.existsSync(destPath),
          'Module is not linked in the cozy-light folder.');
        npmHelpers.uninstall('hello', function (err) {
          assert.equal(err, null, 'Cannot uninstall module.');
          assert(!fs.existsSync(destPath),
            'Module is not removed from the cozy-light folder. '+destPath);
          done();
        });
      });
    });
    it('should remove a local module.', function (done) {
      var destPath = configHelpers.modulePath('test-app');
      var testapp = pathExtra.join(fixturesDir, 'test-app');
      assert(!fs.existsSync(destPath),
        'Module is not removed from the cozy-light folder.');
      npmHelpers.link(testapp, function (err) {
        assert.equal(err, null, 'Cannot install module.');
        assert(fs.existsSync(destPath),
          'Module is not linked in the cozy-light folder.');
        process.chdir(cozyHOME);
        npmHelpers.uninstall('test-app', function (err) {
          assert.equal(err, null, 'Cannot uninstall module.');
          assert(!fs.existsSync(destPath),
            'Module is not removed from the cozy-light folder.');
          done();
        });
      });
    });
  });

  describe('fetchManifest', function(){

    before(function(){
      fs.removeSync(workingDir);
      fs.mkdirSync(workingDir);
      fs.mkdirSync(cozyHOME);
      process.chdir(cozyHOME);
    });

    after(function(){
      try {
        fs.removeSync(workingDir);
      } catch(err) {
        console.log(err);
      }
    });

    it('should fetch manifest from a remote module', function (done) {
      this.timeout(60000);
      npmHelpers.fetchManifest('cozy-labs/hello',
        function (err, manifest, type) {
          assert.equal(err, null, 'Cannot fetch manifest.');
          assert.equal('url', type);
          assert.equal('hello', manifest.name);
          done();
        });
    });
    it('should fetch manifest from an absolute module path.', function (done) {
      var testapp = pathExtra.join(fixturesDir, 'test-app');
      npmHelpers.fetchManifest(testapp, function (err, manifest, type) {
        assert.equal(err, null, 'Cannot fetch from ' + testapp + '.');
        assert.equal('file', type);
        assert.equal('test-app', manifest.name);
        done();
      });
    });
    it('should fetch manifest from a relative module path.', function (done) {
      var testapp = pathExtra.join(fixturesDir, 'test-app');
      npmHelpers.fetchManifest(testapp, function (err, manifest, type) {
        assert.equal(err, null, 'Cannot fetch from ' + testapp + '.');
        assert.equal('file', type);
        assert.equal('test-app', manifest.name);
        done();
      });
    });
  });

  describe('fetchInstall', function(){

    before(function(){
      fs.removeSync(workingDir);
      fs.mkdirSync(workingDir);
      fs.mkdirSync(cozyHOME);
      process.chdir(cozyHOME);
    });

    after(function(){
      try {
        fs.removeSync(workingDir);
      } catch(err) {
        console.log(err);
      }
    });

    it('should fetch then install remote module.', function (done) {
      this.timeout(60000);
      npmHelpers.fetchInstall('cozy-labs/hello',
        function (err, manifest, type) {
          assert.equal(err, null, 'Cannot install module.');
          assert.equal('url', type);
          assert.equal('hello', manifest.name);
          done();
        });
    });
    it('should fetch then install an absolute module path.', function (done) {
      var testapp = pathExtra.join(fixturesDir, 'test-app');
      npmHelpers.fetchManifest(testapp, function (err, manifest, type) {
        assert.equal(err, null, 'Cannot install from ' + testapp + '.');
        assert.equal('file', type);
        assert.equal('test-app', manifest.name);
        done();
      });
    });
    it('should fetch then install a relative module path.', function (done) {
      var testapp = pathExtra.join(fixturesDir, 'test-app');
      npmHelpers.fetchManifest(testapp, function (err, manifest, type) {
        assert.equal(err, null, 'Cannot install from ' + testapp + '.');
        assert.equal('file', type);
        assert.equal('test-app', manifest.name);
        done();
      });
    });
  });
});