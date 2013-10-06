// File: web/js/views/MainView.js

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/main.html'
], function ($, _, Backbone, mainTemplate) {
    var MainView = Backbone.View.extend({
        el: '#content',
        initialize: function () {
            console.log('Initializing Main View');
        },

        render: function (path) {
            $(this.el).html('Loading...');

            var that = this;
            $.ajax({
                type: "HEAD",
                url: appConfig.auth.storageurl + '/' + path.join("/"),
                success: function (data, status, response) {
                    if (status != 'nocontent') {
                        return alert("Could not load server info");
                    }
                    var headers = response.getAllResponseHeaders().split('\n');
                    var metadata = {};

                    headers.forEach(function (header) {
                        var name = splitWithTail(header, ':', 1)[0];
                        var value = splitWithTail(header, ':', 1)[1];
                        var skip = ["Accept-Ranges", "Connection"];
                        if (name && value && $.inArray(name, skip) == -1) {
                            metadata[name.trim()] = value.trim();
                        }
                    });
                    console.log(path);
                    $(that.el).html(_.template(mainTemplate)({
                        name: path[path.length - 1],
                        path: path.slice(0, -1),
                        metadata: metadata
                    }));
                }
            });

            return this;
        },

        load_object: function (object_path) {
        }
    });
    return MainView;

    function splitWithTail(str, delim, count) {
        var parts = str.split(delim);
        var tail = parts.slice(count).join(delim);
        var result = parts.slice(0, count);
        result.push(tail);
        return result;
    }
});