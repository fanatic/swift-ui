define([
    'jquery',
    'underscore',
    'backbone',
    'models/object'
], function ($, _, Backbone, SwiftObject) {
    var SwiftObjects = Backbone.Collection.extend({
        model: SwiftObject,
        url: function () {
            return this.container.url();
        },
        initialize: function () {
            console.log('Object collection has been initialized.');
        }
    });

    return SwiftObjects;
});
