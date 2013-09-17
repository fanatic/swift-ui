define([
    'underscore',
    'backbone',
    'backboneRelational'
], function (_, Backbone) {
    var SwiftObject = Backbone.RelationalModel.extend({
        idAttribute: 'name',
        icon_class: "file",
        initialize: function () {
            console.log('Object model has been initialized.');
        }
    });
    return SwiftObject;
});