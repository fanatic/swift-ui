define([
    'jquery',
    'underscore',
    'backbone',
    'models/object'
], function ($, _, Backbone, ObjectModel) {
    var ObjectList = Backbone.View.extend({
        el: '.swcontainer',
        render: function () {
            $(this.el).html(guestbookFormTemplate);
        },
        events: {
            'click .swcontainer': 'render'
        },
        postMessage: function () {
            var that = this;

            var message = new MessageModel();
            message.save({ message: $('.message').val()}, {
                success: function () {
                    that.trigger('postMessage');
                }
            });
        }
    });
    return ObjectList;
});