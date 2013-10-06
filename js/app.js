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
            '*actions': 'main'
        }
    });

    var initialize = function () {
        var router = new MainRouter();

        $.ajaxSetup({
            statusCode: {
                401: function () {
                    // Redirect to the login page.
                    router.navigate("browser", true)
                },
                403: function () {
                    // 403 -- Access denied
                    router.navigate("browser#denied", true)
                }
            }
        });

        $(document).ajaxSend(function (e, xhr, options) {
            xhr.setRequestHeader("X-Auth-Token", appConfig.auth.token);
        });

        /*loadConfig(function () {
         loadCommandLine();
         setupResizeEvents();
         setupCommandLock();
         setupCLIKeyEvents();
         $('.container').removeClass('container');
         $('html').css('overflow-y', 'hidden');
         $('#pageIndex').live('keydown', function (e) {
         if (e.keyCode == 13) {
         $('#gotoIndexButton').click();
         }
         });
         $('#redisCommandsModal').modal({
         backdrop: false,
         keyboard: false,
         show: false
         });
         });*/

        /* window.Vent = {};
         _.extend(window.Vent, Backbone.Events);
         window.Vent.on('login-successful', this.redirect_to_browser, this);
         function redirect_to_browser(obj) {
         router.navigate('browser', true);
         } */

        console.log("App / initialize");

        router.on('route:main', function (actions) {
            console.log("Loading Login");
            if (!appConfig.auth.token) {
                var loginView = new LoginView();
                loginView.render();

                //TODO: Stop clicking automatically
                $('#loginButton').click();
            }
        });

        router.on('route:browser', function (actions) {
            console.log("Loading Browser");
            if (!appConfig.auth.token) {
                var loginView = new LoginView();
                loginView.render();
                //TODO: Stop clicking automatically
                $('#loginButton').click();
            }

            var browserTreeView = new BrowserTreeView();
            browserTreeView.render();
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };

});