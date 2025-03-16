const CHALLENGE_PAGE = "http://localhost:63342/EarnIt/website/index.html?_ijt=ndh1kupicnstgaro90vc20jl5k";

const getStorageData =  () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["blockedSites", "redirectEnabled", "redirectUrl", "timeOff"], (storedData) => {
      resolve({
        blockedSites: storedData.blockedSites || [],
        redirectEnabled: storedData.redirectEnabled ?? true,
        timeOff: storedData.timeOff
      });
    });
  });
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  getStorageData().then(({ blockedSites, redirectEnabled, redirectUrl, timeOff }) => {
    if (redirectEnabled && blockedSites.some((site) => details.url.includes(site))) {
      chrome.storage.local.set({ originalUrl: details.url });
      chrome.tabs.update(details.tabId, { url: CHALLENGE_PAGE });
    }
  });

  return true
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "redirectBack") {
    chrome.storage.local.get(["originalUrl"], (data) => {
      if (data.originalUrl) {
        console.log("Redirecting back to:", data.originalUrl);
        chrome.tabs.update(sender.tab.id, { url: data.originalUrl });
        setTimer(sender, message.timeLimit, message.startTime);
        sendResponse({ status: "Redirected" });
      } else {
        sendResponse({ status: "No original URL stored" });
      }
    });

    return true;
  }
});


const setTimer = (sender, timeLimit, startTime) => {
    const timeLimitMs = timeLimit * 60 * 1000; // need to mutliply by 60

    setTimeout(() => {
      chrome.tabs.update(sender.tab.id, { url: CHALLENGE_PAGE })
    }, timeLimitMs);
}
