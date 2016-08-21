// Filename: mocks.js

define([
	'jquery',
	'mockjax',
], function ($, mockjax) {
	var initialize = function () {
		console.log("Loading Mocks (config.js auth.endpoint was 'mock')");

		// LOGIN (successful)
		$.mockjax({
			type: 'GET',
			url: "http://example.com:8080/auth/v1.0",
			responseText: {
			},
			headers: {
				'X-Storage-Token': 'mocktoken',
				'X-Storage-Url': 'http://example.com:8080/mock'
			}
		});

		// Tests connection
		$.mockjax({
			type: 'GET',
			url: "http://example.com:8080/mock",
			responseText: {
			},
			headers: {}
		});

		// List Containers
		$.mockjax({
			type: 'GET',
			url: "http://example.com:8080/mock?format=json",
			responseText: [
				{'name': 'container-a', 'count': 5, 'bytes': 1024 },
				{'name': 'container-b', 'count': 5, 'bytes': 1024 }
			],
			headers: {}
		});

		// List Objects
		$.mockjax({
			type: 'GET',
			url: "http://example.com:8080/mock/container-a?delimiter=/&format=json",
			responseText: [
				{'name': 'object-a', 'content_type': 'application/text' },
				{'name': 'object-b', 'content_type': 'application/text' },
				{'name': 'object-c', 'subdir': 'dir', 'content_type': 'application/text' },
				{'name': 'object-d', 'subdir': 'dir', 'content_type': 'application/text' },
				{'name': 'dir', 'content_type': 'application/directory' },
			],
			headers: {}
		});

		// Inspect Account
		$.mockjax({
			type: 'HEAD',
			url: "http://example.com:8080/mock/",
			responseText: {
			},
			headers: {
				"Color": "blue",
				"Size": "large",
				"Bytes": 16034
			}
		});

		// Inspect Container
		$.mockjax({
			type: 'HEAD',
			url: "http://example.com:8080/mock/container-a",
			responseText: {
			},
			headers: {
				"Color": "blue",
				"Size": "large",
				"Bytes": 16034
			}
		});

		// Inspect Object
		$.mockjax({
			type: 'HEAD',
			url: "http://example.com:8080/mock/container-a/object-a",
			responseText: {
			},
			headers: {
				"Color": "blue",
				"Size": "large",
				"Bytes": 16034
			}
		});

	};
	return {
		initialize: initialize
	};
});