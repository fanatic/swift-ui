define([
    'jquery',
    'underscore',
    'backbone',
    'models/container'
], function ($, _, Backbone, ContainerModel) {
    var Containers = Backbone.Collection.extend({
        model: ContainerModel,
        initialize: function () {
            console.log('Container collection has been initialized.');
            this.url = appConfig.auth.storageurl;
        }
    });

    return Containers;
});
