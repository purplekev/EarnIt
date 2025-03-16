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
