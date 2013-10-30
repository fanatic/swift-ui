// File: web/js/views/MainView.js

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/main.html',
    'text!templates/upload.html',
    'text!templates/create.html'
], function ($, _, Backbone, mainTemplate, uploadTemplate, createTemplate) {
    var MainView = Backbone.View.extend({
        initialize: function (args) {
            this.path = args.path;
            this.item_type = args.item_type.charAt(0).toUpperCase() + args.item_type.slice(1);
        },

        events: {
            "click  .download"        : "download_item",
            "click  .edit"            : "update_metadata_show",
            "click  .save-metadata"   : "update_metadata",
            "click  .add-metadata"    : "update_metadata_addpair",
            "click  .remove-metadata" : "update_metadata_removepair",
            "click  .destroy"         : "destroy_item",
            "click  .upload"          : "upload_item_show",
            "change #files"           : "upload_item",
            "click  .create-container": "create_container_show",
            "click  .create-folder"   : "create_folder_show",
            "click  .create-save"     : "create",
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
            xhr.open('GET', appConfig.auth.storageurl + '/' + this.path.join('/'));
            xhr.responseType = 'blob';
            xhr.setRequestHeader("X-Auth-Token", appConfig.auth.token);
            xhr.send();
        },

        update_metadata_show: function() {
            if (! this.$el.hasClass("editing")) {
                this.$el.addClass("editing");
                var that = this;
                $("td.metadata").each(function(index, td) {
                    meta_prefix = "X-" + that.item_type + "-Meta-";
                    if ($(td).attr("id") && $(td).attr("id").substring(0,meta_prefix.length) == meta_prefix) {
                        var value = $(td).text();
                        $(td).html('<input class="metadata form-control" style="display: inline-block; width: 300px;" type="text" placeholder="' + value + '">' +
                            '<button type="button" class="btn btn-default remove-metadata" title="Remove">' +
                            '<span class="glyphicon glyphicon-remove"></span>' +
                            '</button>');
                    }
                });
                $("table.table-metadata").after('<button type="submit" class="btn btn-default save-metadata pull-right">Submit</button>\n');
                $("table.table-metadata").after('<button type="submit" class="btn btn-default add-metadata">Add Metadata Pair</button>');
            }
        },

        update_metadata_addpair: function() {
            $("table.table-metadata > tbody:last")
                .append('<tr class="tobesaved">' + 
                    '<th>X-' + this.item_type + '-Meta-<input class="metadata form-control" style="display: inline-block; width: 300px;" type="text" placeholder="key"></th>' + 
                    '<td><input class="metadata form-control" style="display: inline-block; width: 300px;" type="text" placeholder="value">' +
                        '<button type="button" class="btn btn-default remove-metadata" title="Remove">' +
                        '<span class="glyphicon glyphicon-remove"></span>' +
                        '</button>' +
                    '</td>' + 
                    '</tr>');
        },

        update_metadata_removepair: function(event) {
            var tr = $(event.target).closest("tr");
            var button_icon = tr.find("span.glyphicon");
            if (button_icon.hasClass("glyphicon-remove")) {
                if (tr.hasClass("tobesaved")) {
                    tr.remove();
                } else {
                    tr.find("input.metadata").prop('disabled', true);
                    button_icon.removeClass("glyphicon-remove");
                    button_icon.addClass("glyphicon-plus");
                }
            } else { // Undo remove
                tr.find("input.metadata").prop('disabled', false);
                button_icon.removeClass("glyphicon-plus");
                button_icon.addClass("glyphicon-remove");
            }
        },

        update_metadata: function() {
            headers = {};
            var that = this;
            $(".table-metadata").find("tr").each(function(index, tr) {
                var th = $(tr).find("th");
                var td = $(tr).find("td");
                meta_prefix = "X-" + that.item_type + "-Meta-";
                if (td.attr("id") && td.attr("id").substring(0,meta_prefix.length) == meta_prefix) {
                    var value = td.find("input.metadata");
                    if (value.val() != "") {
                        headers[td.attr("id")] = value.val();
                    } else if (!value.prop("disabled")) {
                        headers[td.attr("id")] = value.attr("placeholder");
                    } //disabled inputs get removed from header list and deleted
                } else if (th.find("input.metadata").length > 0 && th.find("input.metadata").val() != "") {
                    var key = th.find("input.metadata");
                    var value = td.find("input.metadata");
                    headers[meta_prefix + key.val()] = value.val();
                }
            });

            console.log("Saving", headers);
            var that = this;
            $.ajax({
                type: 'POST',
                url: appConfig.auth.storageurl + '/' + that.path.join('/'),
                headers: headers,
                success: function (data, status, response) {
                    that.$el.removeClass("editing");
                    that.refresh_tree();
                },
                error:function (xhr, ajaxOptions, thrownError){
                    if(xhr.status==404) {
                        alert(this.item_type + " no longer exists");
                        that.refresh_tree();
                    } else {
                        console.log(xhr);
                    }
                }
            });
        },

        destroy_item: function () {
            var that = this;

            var result=window.confirm(this.title || 'Delete ' + this.item_type + ' ' + that.path.join('/') + '?');
            if (result) {
                $.ajax({
                    type: "DELETE",
                    url: appConfig.auth.storageurl + '/' + that.path.join('/'),
                    success: function (data, status, response) {
                        if (status != 'nocontent') {
                            return alert("Could not delete");
                        }
                        //TODO: Reload tree, go back to original folder
                        that.refresh_tree();
                        that.clear();
                    }
                });
            }
        },

        upload_item_show: function() {
            $("#upload-modal").html(_.template(uploadTemplate)({
                container: this.path[0],
            }));
            setProgress(0, 'Waiting for upload.');
            $('#upload-modal').modal('show');
            var that = this;
            $('#upload-modal').on('hidden.bs.modal', function () {
              that.refresh_tree();
            });
        },

        upload_item: function(event) {
            console.log("Uploading item");
            setProgress(0, 'Upload started.');
            var files = event.target.files;
            var output = [];

            for (var i = 0, file; file = files[i]; i++) {
                path = this.path.join("/")
                if (this.path.length > 1 && this.item_type != 'Folder') {
                    path = this.path.slice(0,-1).join("/")
                }
                url=appConfig.auth.storageurl + "/" + path + "/" + file.name;

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

        create_container_show: function() {
            $("#create-modal").html(_.template(createTemplate)({
                item_type: 'Container'
            }));
            $('#create-modal').modal('show');
        },

        create_folder_show: function() {
            $("#create-modal").html(_.template(createTemplate)({
                item_type: 'Folder'
            }));
            $('#create-modal').modal('show');
        },

        create: function(event) {
            var name = $("#create-name").val();
            var type = $(event.target).val();
            console.log(name, type);
            if(type == "Container") {
                $.ajax({
                    type: 'PUT',
                    url: appConfig.auth.storageurl + '/' + name,
                    success: function (data, status, response) {
                        $('#create-modal').on('hidden.bs.modal', function () {
                          $.jstree._reference('#nav-tree').refresh();
                        });
                        $('#create-modal').modal('hide');
                    }
                });
            } else if (type == "Folder") {
                path = this.path.join("/")
                if (this.path.length > 1 && this.item_type != 'Folder') {
                    path = this.path.slice(0,-1).join("/")
                }
                $.ajax({
                    type: 'PUT',
                    url: appConfig.auth.storageurl + "/" + path + "/" + name,
                    headers: {
                        "Content-Type": "application/directory"
                    },
                    success: function (data, status, response) {
                        $('#create-modal').on('hidden.bs.modal', function () {
                          $.jstree._reference('#nav-tree').refresh();
                        });
                        $('#create-modal').modal('hide');
                    }
                });
            }
        },

        render: function () {
            $(this.el).html('Loading ' + this.path.join('/') + '...');

            var that = this;
            $.ajax({
                type: "HEAD",
                url: appConfig.auth.storageurl + '/' + that.path.join('/'),
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
                    // Setup Main Template
                    $(that.el).html(_.template(mainTemplate)({
                        name: that.path[that.path.length - 1],
                        item_type: that.item_type,
                        path: that.path.slice(0, -1),
                        metadata: metadata
                    }));
                }
            });

            return this;
        },

        clear: function () {
            this.remove();
        },

        refresh_tree: function() {
            $.jstree._reference('#nav-tree').refresh();
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