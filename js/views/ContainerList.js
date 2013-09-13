define([
    'jquery',
    'underscore',
    'backbone',
    'collections/containers',
    'models/container'
], function ($, _, Backbone, ContainerCollection, ContainerModel) {
    var ContainerList = Backbone.View.extend({
        el: '#containers',
        tagName: 'li',
        template: _.template($('#container-template').html()),
        model: ContainerModel,
        initialize: function () {
            console.log('Initializing ContainerList view.');
            //this.$el = $('#containers');
            //this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var that = this;
            var containers = new ContainerCollection();
            containers.fetch({
                success: function (containers) {
                    $(that.el).html(that.template(this.toJSON()));
                }
            });
            //this.$el.html(this.template(this.model.toJSON()));
            //return this;
        }
    });

    return ContainerList;
});