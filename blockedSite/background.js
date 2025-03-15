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
        console.log(details.url);
        chrome.storage.local.set({ originalUrl: details.url });
        chrome.tabs.update(details.tabId, { url: redirectUrl });
        console.log("Redirecting to:", redirectUrl);
      }
});
