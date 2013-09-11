// File: web/js/views/login.js
window.LoginView = Backbone.View.extend({
    initialize: function () {
        console.log('Initializing Login View');
    },

    events: {
        "click #loginButton": "login"
    },

    render: function () {
        $(this.el).html('<div class="alert alert-error" style="display:none;"></div>' +
            '<button type="submit" class="btn" id="loginButton">Sign in</button>');
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

                window.c = new ContainerCollection({url: appConfig.auth.storageurl});
                //var containerView = new ContainerView(c);
                //containerView.render();


                if (data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page
                    window.location.replace('#');
                }
            }
        });
    }
});