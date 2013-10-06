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
            loadTree();
            return this;
        }
    });
    return BrowserTree;

    //var CmdParser = require('cmdparser');
    function loadTree() {
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
                    var json_dataData = [];

                    data.forEach(function (container, index) {
                        var count = container.count;
                        var bytes = container.bytes;
                        var name = container.name;
                        json_dataData.push({
                            data: name,
                            state: "closed",
                            attr: {
                                id: name,
                                rel: "root"
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
                                    "root": {
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
                                        "addObject": {
                                            icon: 'img/page_add.png',
                                            label: "Add Object",
                                            action: addObject
                                        },
                                        "refresh": {
                                            icon: 'img/arrow_refresh_small.png',
                                            label: "Refresh",
                                            action: function (obj) {
                                                jQuery.jstree._reference("#nav-tree").refresh(obj);
                                            }
                                        },
                                        "remObject": {
                                            icon: 'img/page_delete.png',
                                            label: 'Remove Object',
                                            action: deleteObject
                                        }
                                    };
                                    var rel = node.attr('rel');
                                    if (rel != undefined && rel != 'root') {
                                        delete menu['addObject'];
                                    }
                                    if (rel == 'root') {
                                        delete menu['remObject'];
                                    }
                                    return menu;
                                }
                            },
                            plugins: [ "themes", "json_data", "types", "ui", "contextmenu" ]
                        })
                            .bind("select_node.jstree", treeNodeSelected)
                            .delegate("a", "click", function (event, data) {
                                event.preventDefault();
                            });
                    }
                });
            }
        });
    }

    function treeNodeSelected(event, data) {
        $('#body').html('Loading...');

        var pathParts = getObjectTree().get_path(data.rslt.obj, true);

        var mainView = new MainView();
        mainView.render(pathParts);
    }

    function getFullObjectPath(node) {
        var path = $.jstree._focused().get_path(node, true).slice(1).join('/');
        if (path != "") {
            return path + "/";
        } else {
            return path;
        }
    }

    function getRootContainer(node) {
        return $.jstree._focused().get_path(node, true).slice(0, 1);
    }

    function getObjectTree() {
        return $.jstree._reference('#nav-tree');
    }

    function refreshTree() {
        getObjectTree().refresh();
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
});