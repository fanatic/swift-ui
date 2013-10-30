// Filename: app.js
define([
    'jquery',
    'jstree',
    'underscore',
    'backbone',
    'bootstrap',
    'views/LoginView',
    'views/BrowserTreeView'
], function ($, jstree, _, Backbone, Bootstrap, LoginView, BrowserTreeView) {

    var MainRouter = Backbone.Router.extend({
        routes: {
            'browser': 'browser',
            'accounts': 'accounts',
            'users': 'accounts',
            '*actions': 'browser'
        }
    });

    var initialize = function () {
        var router = new MainRouter();

        // Display login form if the token becomes invalidated
        $.ajaxSetup({
            statusCode: {
                401: function () {
                    // Redirect to the login page.
                    $('#logoutButton').click();
                },
                403: function () {
                    // 403 -- Access denied
                    $('#logoutButton').click();
                }
            }
        });

        // Send token with every ajax request!
        $(document).ajaxSend(function (e, xhr, options) {
            xhr.setRequestHeader("X-Auth-Token", appConfig.auth.token);
        });

        // Setup event listeners
        window.Vent = {};
        _.extend(window.Vent, Backbone.Events);
        window.Vent.on('login-successful', function (obj) {
                var browserTreeView = new BrowserTreeView();
                browserTreeView.render();
            }, this);

        console.log("App / initialize");

        router.on('route:browser', function (actions) {
            console.log("Loading Browser");
            if (!appConfig.auth.token) {
                var loginView = new LoginView();
                loginView.render();
                // Uncomment to login automatically (helps debugging)
                //$('#loginButton').click();
            } else {
                var browserTreeView = new BrowserTreeView();
                browserTreeView.render();
            }
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };

});