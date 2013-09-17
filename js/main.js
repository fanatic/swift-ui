// Require.js allows us to configure shortcut alias
// Their usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        // Major libraries
        jquery: 'libs/jquery',
        bootstrap: 'libs/bootstrap',
        underscore: 'libs/underscore', // https://github.com/amdjs
        backbone: 'libs/backbone', // https://github.com/amdjs
        backboneRelational: 'libs/backbone-relational',
        marionette: 'libs/backbone-marionette'

        // Require.js plugins
        //text: 'libs/require/text',

        // Just a short cut so we can put our html outside the js dir
        // When you have HTML/CSS designers this aids in keeping them out of the js directory
        //templates: '../templates'
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

// Let's kick off the application

require([
    'app'
], function (App) {
    App.initialize();
});