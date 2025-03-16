const CHALLENGE_PAGE = "http://localhost:63342/EarnIt/website/index.html?_ijt=ndh1kupicnstgaro90vc20jl5k";

const getStorageData = async () => {
  const storedData = await chrome.storage.local.get(["blockedSites", "redirectEnabled", "redirectUrl", "timeOff"]);

  return {
    blockedSites: storedData.blockedSites || [],
    redirectEnabled: storedData.redirectEnabled ?? true, // Ensures false is respected
    redirectUrl: CHALLENGE_PAGE,
    timeOff:  storedData.timeOff
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