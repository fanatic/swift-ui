// File: web/js/views/login.js

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html'
], function ($, _, Backbone, loginTemplate) {
    var LoginView = Backbone.View.extend({
        el: '#login-entry',
        logged_in: false,

        events: {
            "click #loginButton":  "login",
            "click #logoutButton": "logout"
        },

        render: function () {
            //TODO: Remember to add error handling div
            $(this.el).html(_.template(loginTemplate, {
                logged_in: this.logged_in,
                username: appConfig.auth.username,
                key: appConfig.auth.key
            }));
            return this;
        },

        login: function (event) {
            $('.alert-error').hide(); // Hide any errors on a new submit
            var url = appConfig.auth.endpoint;
            console.log('Logging in... ');
            var that = this;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'text',
                headers: {
                    "X-Auth-User": $("#login-username").val(),
                    "X-Auth-Key": $("#login-key").val()
                },
                success: function (data, status, xhr) {
                    appConfig.auth.token = xhr.getResponseHeader('X-Storage-Token');
                    appConfig.auth.storageurl = xhr.getResponseHeader('X-Storage-Url');
                    console.log("Login request details: ",
                                appConfig.auth.token,
                                appConfig.auth.storageurl);
                    that.logged_in = true;
                    that.render();
                    window.Vent.trigger('login-successful', appConfig.auth.storageurl);
                },
                error: function (xhr, status, error)  {
                    console.log(status, error);
                    $("#login-username").parent().addClass("has-error");
                    $("#login-key").parent().addClass("has-error");
                    return false;
                }
            });
            return false;
        },

        logout: function (event) {
            appConfig.auth.token = null;
            appConfig.auth.storageurl = null;
            Backbone.history.navigate("/", true);
            window.location.reload(true);
        }
    });
    return LoginView;
});