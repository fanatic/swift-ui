define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Container = Backbone.Model.extend({
        initialize: function () {
            console.log('Container model has been initialized.');
            this.objects = new SwiftObjectCollection;
            this.objects.url = appConfig.auth.storageurl + '/' + this.get('name');
            //this.objects.on("reset", this.updateCounts)
        }
    });
    return Container;
});