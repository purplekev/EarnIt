chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const { url } = details;
  
    const { blockedSites = [], redirectEnabled = true, redirectUrl = "http://127.0.0.1:5500/EarnIt/website/index.html" } = await chrome.storage.local.get();
  
    if (redirectEnabled && blockedSites.some((site) => url.includes(site))) {
      chrome.tabs.update(details.tabId, { url: redirectUrl });
      console.log("Redirecting to:", redirectUrl);
    }

    // background.js
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   if (message.type === 'messageToWebApp') {
    //     console.log(message.data);  // Handle the message from popup.js
    //     // You can use chrome.tabs API to send the message to the web app's page
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //       chrome.tabs.sendMessage(tabs[0].id, { type: 'messageFromBackground', data: message.data });
    //     });
    //   }
    // });

  });
  