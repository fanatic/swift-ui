// Filename: app.js
$(function () {
    //$('#nav-tree').jstree({
    //    "plugins": [ "html_data", "themes"],
    //    "themes": {
    //        "icons": false
    //    }
    //});
});


window.Container = Backbone.Model.extend({
    initialize: function () {
        console.log('Container model has been initialized.');
        this.objects = new SwiftObjectCollection;
        this.objects.url = appConfig.auth.storageurl + '/' + this.get('name');
        //this.objects.on("reset", this.updateCounts)
    }
});

window.ContainerCollection = Backbone.Collection.extend({
    model: Container,
    url: function () {
        return this.instanceUrl;
    },
    initialize: function (props) {
        this.instanceUrl = props.url;
        this.fetch();
    }
});

window.SwiftObject = Backbone.Model.extend({
    initialize: function () {
        console.log('Object model has been initialized.');
    }
});

window.SwiftObjectCollection = Backbone.Collection.extend({
    model: SwiftObject
});

window.ContainerView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#container-template').html()),
    initialize: function () {
        this.$el = $('#containers');
        //this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});


$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader("X-Auth-Token", appConfig.auth.token);
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


$('#content').html(new LoginView().render().el);

$('#loginButton').click();
