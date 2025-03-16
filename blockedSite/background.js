const CHALLENGE_PAGE = "http://localhost:63342/EarnIt/website/index.html?_ijt=ndh1kupicnstgaro90vc20jl5k";

const getStorageData = async () => {
  const storedData = await chrome.storage.local.get(["blockedSites", "redirectEnabled", "redirectUrl", "timeOff"]);

  return {
    blockedSites: storedData.blockedSites || [],
    redirectEnabled: storedData.redirectEnabled ?? true, // Ensures false is respected
    redirectUrl: CHALLENGE_PAGE,
    timeOff: storedData.timeOff
  };
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

async function analyzeBrowsingHistory() {
  chrome.history.search({text: '', maxResults: 100, startTime: Date.now() - (30 * 24 * 60 * 60 * 1000)}, (historyItems) => {
      let domainCount = {};
      // Count visits per domain
      historyItems.forEach((item) => {
          let url = new URL(item.url);
          let domain = url.hostname;
          if (domain.includes("google.com")) {
            return;
          }
          else if (!domainCount[domain]) {
              domainCount[domain] = 0;
          }
          domainCount[domain] += item.visitCount || 1;
      });
chrome.webNavigation.onBeforeNavigate.addListener(

  async (details) => {

    const { blockedSites, redirectEnabled, redirectUrl, timeOff } = await getStorageData();

    if (redirectEnabled && blockedSites.some((site) => details.url.includes(site))) {
      chrome.storage.local.set({ originalUrl: details.url });
      chrome.tabs.update(details.tabId, { url: redirectUrl });
      console.log("Redirecting to:", redirectUrl);
    }
  });

let activeTabStartTime = 0;
let currentActiveUrl = '';
let timer = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleTabChange(changeInfo.url);
  }
});

function handleTabChange(url) {
  if (timer) {
    clearInterval(timer);
    saveTimeSpent();
  }

  currentActiveUrl = url;
  activeTabStartTime = Date.now();

  if (isTrackedUrl(url)) {
    startTracking();
  }
}

function startTracking() {
  timer = setInterval(async () => {
    const timeSpent = Math.floor((Date.now() - activeTabStartTime) / 1000 / 60);
    if (timeSpent >= 1) {
      const { token = 0 } = await chrome.storage.local.get('token');
      if (token > 0) {
        await chrome.storage.local.set({ token: token - 1 });
      }
      activeTabStartTime = Date.now();
    }
  }, 60000);
}

async function isTrackedUrl(url) {
  if (!url) return false;
  const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
  return blockedSites.some(site => url.includes(site));
}

function saveTimeSpent() {
  const timeSpent = Math.floor((Date.now() - activeTabStartTime) / 1000);
}

      // Sort by most visited
      let sortedDomains = Object.entries(domainCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3); // Top 3 most visited domains

      console.log("Top visited domains:", sortedDomains);

      // Store results in Chrome storage
      chrome.storage.local.set({ recommendedBlockedSites: sortedDomains });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeHistory") {
      analyzeBrowsingHistory();
      sendResponse({ status: "History analyzed" });
  }
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
