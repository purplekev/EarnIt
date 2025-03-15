// content.js (You need to include this as a content script in your manifest)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'messageFromBackground') {
      console.log('Received message in web app:', message.data);
    }
  });
  