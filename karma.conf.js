module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: [ 'jasmine' ],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'test/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': 'coverage'
    },

    reporters: [ 'progress', 'coverage' ],

    exclude: [ ],

    port: 8080,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [ 'Chrome' ],

    singleRun: false
  });
};
