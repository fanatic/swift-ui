swift-ui
========
This is alpha quality code that requires some cleanup and organization to 
make better use of the backbone modules.  Give it a try!

Simply extract in a static web server directory (staticweb should work too),
modify js/config.js for your username, key, and auth url, and give it a go.

Features:
- Tree browser of account, containers, folders, and objects
- Upload and download objects
- Create containers and hierarchical folders
- Modify metadata of accounts, containers, and objects

Potential Improvements:
- swauth integration (account and user manipulation)
- Ensure limitations are validated in js (Container names < 256 bytes, no / character, etc)
- Paginate container list
- Use count/bytes used data to visually indicate usage with graph
- Large object support
- Assign CORS Header support
- Enable file compression
- Expiring object support
- Object versioning support
- Copy object support
- Multi-delete support (recursive folder deletes)
- Container & Object ACLs


![Screenshot](https://github.com/fanatic/swift-ui/raw/backbone/img/screenshot.png)
