chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const { url } = details;
  
    const { blockedSites = [], redirectEnabled = true, redirectUrl = "https://www.google.com" } = await chrome.storage.local.get();
  
    if (redirectEnabled && blockedSites.some((site) => url.includes(site))) {
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    }
  });
  