swift-ui
========
This is alpha quality code that requires some cleanup and organization to 
make better use of the backbone modules.  Give it a try!

Simply extract in a static web server directory (staticweb should work too),
modify js/config.js for your username, key, and auth url, and give it a go.

![Screenshot](https://github.com/fanatic/swift-ui/raw/master/img/screenshot.png)

Features:

*   Tree browser of account, containers, folders, and objects
*   Upload and download objects
*   Create containers and hierarchical folders
*   Modify metadata of accounts, containers, and objects

Potential Improvements:

*   swauth integration (account and user manipulation)
*   Ensure limitations are validated in js (Container names < 256 bytes, no / character, etc)
*   Paginate container list
*   Use count/bytes used data to visually indicate usage with graph
*   Large object support
*   Assign CORS Header support
*   Enable file compression
*   Expiring object support
*   Object versioning support
*   Copy object support
*   Multi-delete support (recursive folder deletes)
*   Container & Object ACLs

Installation
------------
Ensure [staticweb is enabled](http://docs.openstack.org/api/openstack-object-storage/1.0/content/Create_Static_Website-dle4000.html) in your proxy-server.conf (both in pipeline and filter config) and working. 

1.  `git clone https://github.com/fanatic/swift-ui`
1.  `cd swift-ui`
1.  `vi js/config.js # modify to match your auth url, username, and key`
1.  `swift upload swift-ui *`
1.  `swift post -r '.r:*' swift-ui`
1.  `swift post -m 'web-index:index.html' swift-ui`
1.  Visit `http://192.168.2.77:8080/v1/AUTH_test/swift-ui/` 
    (where `http://192.168.2.77:8080/v1/AUTH_test` is my storage url for my test account)
