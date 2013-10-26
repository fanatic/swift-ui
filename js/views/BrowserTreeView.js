// File: web/js/views/BrowserTree.js

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/browser-tree.html',
    'views/MainView'
], function ($, _, Backbone, browserTreeTemplate, MainView) {
    var BrowserTree = Backbone.View.extend({
        el: '#browser-tree',

        initialize: function () {
            console.log('Initializing Browser Tree View');
        },

        render: function () {
            $(this.el).html(_.template(browserTreeTemplate));
            this.loadTree();
            return this;
        },

        loadTree: function () {
            var that = this;
            $.get(appConfig.auth.storageurl, function (isConnected) {
                if (isConnected) {
                    $('#nav-tree').bind("loaded.jstree", function () {
                        var tree = getObjectTree();
                        if (tree) {
                            var root = tree._get_children(-1)[0];
                            tree.open_node(root, null, true);
                        }
                    });
                    getContainerInfo(function (data) {

                        json_dataData = {
                            data: appConfig.auth.username.split(':')[0],
                            state: "open",
                            attr: {
                                id: appConfig.auth.username.split(':')[0],
                                rel: "account"
                            },
                            children: []
                        };

                        data.forEach(function (container, index) {
                            var count = container.count;
                            var bytes = container.bytes;
                            var name = container.name;
                            json_dataData.children.push({
                                data: name,
                                state: "closed",
                                attr: {
                                    id: name,
                                    rel: "container"
                                }
                            });
                            if (index === data.length - 1) {
                                return onJSONDataComplete();
                            }
                        });
                        function onJSONDataComplete() {
                            $('#nav-tree').jstree({
                                json_data: {
                                    data: json_dataData,
                                    ajax: {
                                        url: function (node) {
                                            if (node !== -1) {
                                                var path = getFullObjectPath(node);
                                                var root = getRootContainer(node);
                                                var prefix = "";
                                                if (path != "") {
                                                    prefix = '&prefix=' + encodeURIComponent(path);
                                                }
                                                return appConfig.auth.storageurl + '/' + encodeURIComponent(root) + '?delimiter=/' + prefix + '&format=json';
                                            }
                                            var root = getRootContainer(node);
                                            return appConfig.auth.storageurl + '/' + encodeURIComponent(root);
                                        },
                                        success: function (data) {
                                            var json_dataData = [];
                                            data.forEach(function (obj, index) {
                                                var type = "object";
                                                var state = null;
                                                var content_type = obj.content_type;
                                                var name = obj.name;

                                                if (content_type == "application/directory" ||
                                                    content_type == "text/directory") {
                                                    type = "object-folder";
                                                }

                                                if (obj.subdir) {
                                                    name = obj.subdir;
                                                    state = "closed";
                                                    type = "folder";
                                                    var n_arry = name.split('/');
                                                    if (n_arry.length >= 2) {
                                                        name = n_arry[n_arry.length - 2];
                                                    }
                                                } else {
                                                    var n_arry = name.split('/');
                                                    name = n_arry[n_arry.length - 1];
                                                }

                                                json_dataData.push({
                                                    data: name,
                                                    state: state,
                                                    attr: {
                                                        id: name,
                                                        rel: type,
                                                        title: name
                                                    }
                                                });
                                            });
                                            return json_dataData;
                                        }
                                    },
                                    progressive_render: true
                                },
                                types: {
                                    types: {
                                        "account": {
                                            icon: {
                                                image: 'img/application.png'
                                            }
                                        },
                                        "container": {
                                            icon: {
                                                image: 'img/drive_network.png'
                                            }
                                        },
                                        "object-folder": {
                                            icon: {
                                                image: 'img/folder.png'
                                            }
                                        },
                                        "folder": {
                                            icon: {
                                                image: 'img/folder.png'
                                            },
                                            select_node: function () {
                                                return false;
                                            }
                                        },
                                        "object": {
                                            icon: {
                                                image: 'img/page.png'
                                            }
                                        }
                                    }
                                },
                                contextmenu: {
                                    items: function (node) {
                                        var menu = {
                                            "refresh": {
                                                icon: 'img/arrow_refresh_small.png',
                                                label: "Refresh",
                                                action: function (obj) {
                                                    jQuery.jstree._reference("#nav-tree").refresh(obj);
                                                }
                                            },
                                            "addContainer": {
                                                icon: 'img/drive_add.png',
                                                label: "Add Container",
                                                action: addContainer
                                            },
                                            /*"addObject": {
                                                icon: 'img/page_add.png',
                                                label: "Add Object",
                                                action: addObject
                                            },
                                            "remObject": {
                                                icon: 'img/page_delete.png',
                                                label: 'Remove Object',
                                                action: deleteObject
                                            }*/
                                        };
                                        var rel = node.attr('rel');
                                        if (rel != undefined && rel != 'account') {
                                            delete menu['addContainer'];
                                        }
                                        if (rel == 'account') {
                                            delete menu['remObject'];
                                        }
                                        return menu;
                                    }
                                },
                                plugins: [ "themes", "json_data", "types", "ui", "contextmenu" ]
                            })
                                .bind("select_node.jstree", that.treeNodeSelected)
                                .delegate("a", "click", function (event, data) {
                                    event.preventDefault();
                                });
                        }
                    });
                }
            });
        },

        treeNodeSelected: function (event, data) {
            console.log("Loading tree node");
            var type = getObjectTree()._get_type(data.rslt.obj);
            var pathParts = getObjectTree().get_path(data.rslt.obj, true).slice(1);
            console.log(type, pathParts);
            var mainView = new MainView({item_type: type, path: pathParts});
            $("#content").append(mainView.render().el);

            if(this.selected_object_view) {
                this.selected_object_view.clear();
            }
            this.selected_object_view = mainView;
        }


    });
    return BrowserTree;

    function getFullObjectPath(node) {
        var path = $.jstree._focused().get_path(node, true).slice(2).join('/');
        if (path != "") {
            return path + "/";
        } else {
            return path;
        }
    }

    function getRootContainer(node) {
        return $.jstree._focused().get_path(node, true).slice(1, 2);
    }

    function getObjectTree() {
        return $.jstree._reference('#nav-tree');
    }

    function refreshTree() {
        getObjectTree().refresh();
    }

    function addContainer(containerId, path) {
        var mainView = new MainView();
        mainView.addObject(path);
    }

    function addObject(containerId, path) {
        var mainView = new MainView();
        mainView.addObject(path);
    }

    function deleteObject(containerId, path) {
        var mainView = new MainView();
        mainView.deleteObject(path);
    }

    function getContainerInfo(callback) {
        $.get(appConfig.auth.storageurl + "?format=json", function (data, status) {
            callback(data)
        });
    }
    //var CmdParser = require('cmdparser');
});