// Filename: app.js
//$(function () {
//$('#nav-tree').jstree({
//    "plugins": [ "html_data", "themes"],
//    "themes": {
//        "icons": false
//    }
//});
//});

define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'views/LoginView',
    'views/ContainerRoot'
], function ($, _, Backbone, Bootstrap, LoginView, ContainerRoot) {

    /*var MainRouter = Backbone.Router.extend({
     routes: {
     '*actions': 'defaultAction',
     'messages': 'showMessageAboutMongo', // All urls will trigger this route
     'about': 'showAbout'
     }
     });*/

    var initialize = function () {
        Backbone.pubSub = _.extend({}, Backbone.Events);
        //var router = new MainRouter();

        $(document).ajaxSend(function (e, xhr, options) {
            xhr.setRequestHeader("X-Auth-Token", appConfig.auth.token);
        });

        var containerRoot = new ContainerRoot();
        $("#nav-tree").html(containerRoot.el);
        var loginView = new LoginView();
        loginView.render();

        $('#loginButton').click();

        console.log("App / initialize");


        /*
         router.on('route:defaultAction', function (actions) {

         var mainView = new MainView();
         mainView.render();

         var cabinView = new CabinView();
         cabinView.render();

         console.log("default route");

         });

         router.on('route:showMessageAboutMongo', function () {

         console.log("display helpful message about setting up mongo");

         });

         router.on('route:showAbout', function () {

         console.log("display about");

         });

         Backbone.history.start();
         */

    };
    return {
        initialize: initialize
    };
});


//c  = new ContainerCollection({url: appConfig.auth.storageurl})
//var containerView = new ContainerView(c);

//$.ajaxSetup({
//    statusCode: {
//        401: function(){
//            // Redirec the to the login page.
//            window.location.replace('/#login');
//
//        },
//        403: function() {
//            // 403 -- Access denied
//            window.location.replace('/#denied');
//        }
//    }
//});


