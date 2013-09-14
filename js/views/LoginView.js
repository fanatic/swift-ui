// File: web/js/views/login.js

define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerList'
], function ($, _, Backbone, ContainerList) {
    var LoginView = Backbone.View.extend({
        el: '#login-entry',
        initialize: function () {
            console.log('Initializing Login View');
        },

        events: {
            "click #loginButton": "login"
        },

        render: function () {
            //TODO: Remember to add error handling div
            $(this.el).html('<button id="loginButton" type="button" class="btn btn-default navbar-btn">Sign in</button>');
            return this;
        },

        login: function (event) {
            event.preventDefault(); // Don't let this button submit the form
            $('.alert-error').hide(); // Hide any errors on a new submit
            var url = appConfig.auth.endpoint;
            console.log('Logging in... ');
            $.ajax({
                url: url,
                type: 'GET',
                dataType: "json",
                headers: {
                    "X-Auth-User": appConfig.auth.username,
                    "X-Auth-Key": appConfig.auth.key
                },
                complete: function (data) {
                    console.log(["Login request details: ", data]);
                    appConfig.auth.token = data.getResponseHeader('X-Storage-Token');
                    appConfig.auth.storageurl = data.getResponseHeader('X-Storage-Url')
                    console.log(appConfig.auth.token);
                    console.log(appConfig.auth.storageurl);

                    if (data.error) {  // If there is an error, show the error messages
                        $('.alert-error').text(data.error.text).show();
                    }

                    var containerList = new ContainerList();
                    containerList.render();

                    //else { // If not, send them back to the home page
                    //   window.location.replace('#');
                    // }
                }
            });
        }
    });
    return LoginView;
});