define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var SwiftObject = Backbone.Model.extend({
        initialize: function () {
            console.log('Object model has been initialized.');
        }
    });
    return SwiftObject;
});