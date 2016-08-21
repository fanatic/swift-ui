describe('swift-ui homepage', function() {
	beforeEach(function () {
		browser.driver.get('http://localhost:8888/index.html');
	});

	it('should log in', function() {
		//browser.pause();
		// Allow page to load
		browser.sleep(10000);

		expect(browser.driver.getTitle()).toEqual('Swift UI');
		browser.driver.findElement(by.id('loginButton')).click();

		// Wait for login
		browser.sleep(1000);

		var loginText = browser.driver.findElement(by.css('#login-entry .navbar-text'));
		expect(loginText.getText()).toEqual('Signed in as test:tester');
	});

	it('should list accounts and details', function() {
		browser.sleep(10000);
		browser.driver.findElement(by.id('loginButton')).click();

		// Wait for login
		browser.sleep(2000);

		//browser.pause();

		var account = browser.driver.findElement(by.css('#test[rel="account"] a'));
		expect(account.getText()).toEqual(' test');
		account.click();

		// Wait for account details to laod
		browser.sleep(1000);

		var breadcrumb = browser.driver.findElement(by.css('.breadcrumb > li:first-child'));
		expect(breadcrumb.getText()).toEqual('test');

		var header = browser.driver.findElement(by.css('.page-header > h1 > small'));
		expect(header.getText()).toEqual('Account');

		var metadata = browser.driver.findElement(by.css('#Color.metadata'));
		expect(metadata.getText()).toEqual('blue');
	});
});
