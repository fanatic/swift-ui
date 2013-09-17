define([
    'jquery',
    'underscore',
    'backbone',
    'models/object'
], function ($, _, Backbone, ObjectModel) {
    var ObjectList = Backbone.View.extend({
        el: '.swcontainer',
        render: function () {
            console.log('Rendering ObjectList view.');
            $(this.el).html(guestbookFormTemplate);
        },
        events: {
            'click .swcontainer': 'render'
        }
    });
    return ObjectList;
});