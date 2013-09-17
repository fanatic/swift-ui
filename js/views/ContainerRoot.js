define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'views/ContainerList',
    'collections/containers'
], function ($, _, Backbone, Marionette, ContainerList, ContainerCollection) {
    var ContainerRoot = Backbone.Marionette.CollectionView.extend({
        tagName: "ul",
        itemView: ContainerList,
        initialize: function () {
            console.log('Initializing ContainerRoot view.');
            Backbone.pubSub.on('login-successful', this.redraw, this);
        },
        redraw: function (url) {
            console.log('Redrawing ContainerRoot view.');
            var that = this;
            this.collection = new ContainerCollection({url: url});
            this.collection.fetch({
                success: function (containers) {
                    that.render();
                },
                error: function (response) {
                    console.log(response, "ContainerList error!");
                }
            });
            return this;
        }
    });

    return ContainerRoot;
});