exports.config = {
  baseUrl: 'http://localhost:8888/',
	//seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.js'],

  // Sauce Labs Setup
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  // restartBrowserBetweenTests: true,

  onPrepare: function(){
      var caps = browser.getCapabilities()
  },

  multiCapabilities: [{
    browserName: 'firefox',
    version: '32',
    platform: 'OS X 10.10',
    name: "firefox-tests",
    shardTestFiles: true,
    maxInstances: 2,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
  }, {
    browserName: 'chrome',
    version: '41',
    platform: 'Windows 7',
    name: "chrome-tests",
    shardTestFiles: true,
    maxInstances: 2,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
  }],

  onComplete: function() {
    var printSessionId = function(jobName){
      browser.getSession().then(function(session) {
        console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
      });
    }
    printSessionId("Insert Job Name Here");
  }
};
