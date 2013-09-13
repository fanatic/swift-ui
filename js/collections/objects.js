define([
    'jquery',
    'underscore',
    'backbone',
    'models/message'
], function ($, _, Backbone, MessageModel) {
    var SwiftObjects = Backbone.Collection.extend({
        model: SwiftObject
    });

    return SwiftObjects;
});
