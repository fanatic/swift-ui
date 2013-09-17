define([
    'underscore',
    'backbone',
    'backboneRelational',
    'models/object',
    'collections/objects'
], function (_, Backbone, BR, ObjectModel, SwiftObjects) {
    var Container = Backbone.RelationalModel.extend({
        idAttribute: 'name',
        icon_class: "hdd",
        relations: [
            {
                type: Backbone.HasMany,
                key: 'objects',
                relatedModel: ObjectModel,
                collectionType: SwiftObjects,
                reverseRelation: {
                    key: 'container',
                    includeInJSON: true
                }
            }
        ],
        initialize: function () {
            // var objectsList = new ObjectList();
            console.log('Container model has been initialized.');
            this.urlRoot = appConfig.auth.storageurl;
            //this.objects = new SwiftContainerCollection;
            //this.objects.url = appConfig.auth.storageurl + '/' + this.get('name');
            //this.objects.on("reset", this.updateCounts)
        }
    });
    return Container;
});