define([
    'jquery',
    'underscore',
    'backbone',
    'marionette'
], function ($, _, Backbone, Marionette) {
    var ContainerList = Backbone.Marionette.CompositeView.extend({
        template: '#container-template',
        tagName: "li",
        events: {
            'click .swcontainer': 'clicked'
        },
        initialize: function () {
            console.log('Initializing ContainerList view.');
            this.collection = this.model.attributes.objects;
            //this.collection = this.model.objects;
            //this.listenTo(this.collection, "change", this.render);
        },
        clicked: function (events) {
            event.preventDefault();
            var that = this;
            this.model.get('objects').fetch({
                success: function () {
                    console.log(that.model);
                    that.renderModel();
                }
            });
        },
        serializeData: function () {
            var data = this.model.toJSON();
            data.icon_class = this.model.icon_class;

            return data;
        },
        appendHtml: function (cv, iv) {
            cv.$("ul:first").append(iv.el);
        }
        /*render: function () {
         console.log('Rendering ContainerList view.');
         var that = this;
         var containers = new ContainerCollection();
         containers.fetch({
         success: function (containers) {
         containers.models[0];
         console.log(containers.models[0].get('objects'));
         $(that.el).html(that.template({containers: containers.models, _: _}));
         },
         error: function (response) {
         console.log(response, "ContainerList error!");
         }
         });
         return this;
         }*/
    });

    return ContainerList;
});