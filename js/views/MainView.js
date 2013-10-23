// File: web/js/views/MainView.js

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/main.html',
    'text!templates/upload.html'
], function ($, _, Backbone, mainTemplate, uploadTemplate) {
    var MainView = Backbone.View.extend({
        el: '#content',
        path: "",
        container: "",
        initialize: function () {
            console.log('Initializing Main View');
        },

        events: {
            "click .download" : "download_item",
            "click .destroy"  : "destroy_item",
            "click .upload"   : "upload_item_show",
            "change #files"   : "upload_item"
        },

        download_item: function () {
            console.log("Downloading item");
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    console.log("Success");
                    console.log(this.response, typeof this.response);
                    var objectUrl = URL.createObjectURL(this.response);
                    document.location = objectUrl;
                }
            }
            xhr.open('GET', appConfig.auth.storageurl + '/' + this.path);
            xhr.responseType = 'blob';
            xhr.setRequestHeader("X-Auth-Token", appConfig.auth.token);
            xhr.send();
        },

        destroy_item: function () {
            var that = this;
            $.ajax({
                type: "DELETE",
                url: appConfig.auth.storageurl + '/' + that.path,
                success: function (data, status, response) {
                    if (status != 'nocontent') {
                        return alert("Could not delete");
                    }
                    // Change url
                    window.location.href = "#browser";
                }
            });
        },

        upload_item_show: function() {
            $("#upload-modal").html(_.template(uploadTemplate)({
                container: this.container
            }));
            setProgress(0, 'Waiting for upload.');
            $('#upload-modal').modal('show');
        },

        upload_item: function(event) {
            console.log("Uploading item");
            setProgress(0, 'Upload started.');
            var files = event.target.files;
            var output = [];

            for (var i = 0, file; file = files[i]; i++) {
                url=appConfig.auth.storageurl + "/" + this.container + "/" + file.name;

                // Create CORS Request
                var xhr = new XMLHttpRequest();
                if ("withCredentials" in xhr) {
                    xhr.open('PUT', url, true);
                } else if (typeof XDomainRequest != "undefined") {
                    xhr = new XDomainRequest();
                    xhr.open('PUT', url);
                } else {
                    xhr = null;
                }
                
                // Upload given file to Swift
                if (!xhr) {
                    setProgress(0, 'CORS not supported');
                } else {
                    xhr.onload = function() {
                        if(xhr.status == 200 || xhr.status == 201) {
                            setProgress(100, 'Upload completed.');
                        } else {
                            setProgress(0, 'Upload error: ' + xhr.status);
                        }
                    };

                    xhr.onerror = function() {
                        setProgress(0, 'XHR error.');
                    };

                    xhr.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            var percentLoaded = Math.round((e.loaded / e.total) * 100);
                            setProgress(percentLoaded, percentLoaded == 100 ? 'Finalizing.' : 'Uploading.');
                        }
                    };

                    xhr.setRequestHeader('X-Auth-Token', appConfig.auth.token);
                    xhr.send(file);
                }
            }
        },

        render: function (path) {
            $(this.el).html('Loading...');

            this.container = path[0];
            this.path = path.join("/");

            var that = this;
            $.ajax({
                type: "HEAD",
                url: appConfig.auth.storageurl + '/' + that.path,
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
                    // Setup Main Template
                    $(that.el).html(_.template(mainTemplate)({
                        name: path[path.length - 1],
                        path: path.slice(0, -1),
                        metadata: metadata
                    }));
                }
            });

            return this;
        }
    });
    return MainView;

    function setProgress(percent, statusLabel) {
        $('.percent').width( percent + '%' );
        $('.percent').text( percent + '%' );
        $('#progress_bar').addClass( 'loading' );
        $('#status').text( statusLabel );
    }

    function splitWithTail(str, delim, count) {
        var parts = str.split(delim);
        var tail = parts.slice(count).join(delim);
        var result = parts.slice(0, count);
        result.push(tail);
        return result;
    }
});