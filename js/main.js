// Require.js allows us to configure shortcut alias
// Their usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        // Major libraries
        jquery: 'libs/jquery',
        jstree: 'libs/jstree/jquery.jstree',
        bootstrap: 'libs/bootstrap',
        underscore: 'libs/underscore', // https://github.com/amdjs
        backbone: 'libs/backbone', // https://github.com/amdjs
        text: 'libs/require/text'
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'jstree': {
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