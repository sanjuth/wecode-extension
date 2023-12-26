console.log('This is the background page.');
console.log('Put the background scripts here.');
// background.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'fetchCookies') {
    const url = 'https://leetcode.com/problemset/';

    chrome.cookies.getAll({ url: url }, function (cookies) {
      if (chrome.runtime.lastError) {
        console.error('Error fetching cookies:', chrome.runtime.lastError);
        return;
      }

      console.log('Fetched cookies:', cookies);

      const csrfToken = cookies.find(cookie => cookie.name === 'csrftoken');
      const leetcodeSession = cookies.find(cookie => cookie.name === 'LEETCODE_SESSION');

      chrome.runtime.sendMessage({
        action: 'cookiesFetched',
        csrfToken: csrfToken ? csrfToken.value : null,
        leetcodeSession: leetcodeSession ? leetcodeSession.value : null
      });
    });
  }

  if (request.action === 'storeToken' && request.sessionToken) {
    chrome.storage.local.set({ 'sessionToken': request.sessionToken }, function () {
      console.log('Session token saved in extension local storage');
    });
    
  }
});
