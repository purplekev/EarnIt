document.addEventListener("DOMContentLoaded", async () => {
    const toggleRedirect = document.getElementById("toggleRedirect");
    const siteList = document.getElementById("siteList");
    const newSite = document.getElementById("newSite");
    const addSite = document.getElementById("addSite");
    const token = document.getElementById("token");
    const addToken = document.getElementById("addToken")

    // Load saved data
    const { blockedSites = [], redirectEnabled = true, redirectDisabled = false,  timeOff = 0} = await chrome.storage.local.get();

    // Populate UI
    toggleRedirect.checked = redirectEnabled;
    toggleRedirect.unchecked = redirectDisabled
    blockedSites.forEach((site) => addSiteToList(site));

    // Toggle redirect on/off
    toggleRedirect.addEventListener("change", () => {
      chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
    });

    // Add site
    addSite.addEventListener("click", () => {
      const site = newSite.value.trim();
      if (site && !blockedSites.includes(site)) {
        blockedSites.push(site);
        chrome.storage.local.set({ blockedSites });
        addSiteToList(site);
        newSite.value = "";
      }
    });

    // Add site to UI with remove button
    function addSiteToList(site) {
      const li = document.createElement("li");
      li.textContent = site;
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        const index = blockedSites.indexOf(site);
        if (index > -1) {
          blockedSites.splice(index, 1);
          chrome.storage.local.set({ blockedSites });
          li.remove();
        }
      });
      li.appendChild(removeBtn);
      siteList.appendChild(li);
    }
  });
