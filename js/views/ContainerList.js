define([
    'jquery',
    'underscore',
    'backbone',
    'collections/containers'
], function ($, _, Backbone, ContainerCollection) {
    var ContainerList = Backbone.View.extend({
        el: '#containers',
        template: _.template($('#containers-template').html()),
        initialize: function () {
            console.log('Initializing ContainerList view.');
            //this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var that = this;
            var containers = new ContainerCollection();
            containers.fetch({
                success: function (containers) {
                    $(that.el).html(that.template({containers: containers.models, _: _}));
                },
                error: function (response) {
                    console.log(response, "ContainerList error!");
                }
            });
            return this;
        }
    });

    return ContainerList;
});