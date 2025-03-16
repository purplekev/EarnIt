document.addEventListener("DOMContentLoaded", async () => {
  const toggleRedirect = document.getElementById("toggleRedirect");
  const siteList = document.getElementById("siteList");
  const newSite = document.getElementById("newSite");
  const addSite = document.getElementById("addSite");
  const token = document.getElementById("token");
  const addToken = document.getElementById("addToken")

  // Load saved data
  const { blockedSites = [], redirectEnabled = true, redirectDisabled = false, timeOff = 0 } = await chrome.storage.local.get();

  // Populate UI
  toggleRedirect.checked = redirectEnabled;
  toggleRedirect.unchecked = redirectDisabled
  blockedSites.forEach((site) => addSiteToList(site));

  // Toggle redirect on/off
  toggleRedirect.addEventListener("change", () => {
    chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
  });

  setInterval(updateTimeDisplays, 5000);

  // // Event listener for the button click
  // addToken.addEventListener("click", () => {
  //     let tokenValue = Number(token.value) + 1;  // Use token.value to get the current value

  //     // Update the displayed token count
  //     token.value = tokenValue;  // Set token.value instead of tokenInput.value

  //     // Check if token count exceeds 10
  //     if (tokenValue >= 10) {
  //         toggleRedirect.checked = false;
  //         chrome.storage.local.set({ redirectEnabled: false });
  //     }
  // });

  // if (addToken) {
  //     addToken.addEventListener('click', () => {
  //         let tokenValue = Number(token.value) + 1;  // Use token.value to get the current value
  //
  //         // Update the displayed token count
  //         token.value = tokenValue;  // Set token.value instead of tokenInput.value
  //
  //         // Check if token count exceeds 10
  //         if (tokenValue >= 10) {
  //             toggleRedirect.checked = false;
  //             chrome.storage.local.set({ redirectEnabled: false });
  //         }
  //     });
  // } else {
  //     console.error("Element with id 'addToken' not found!");
  // }


  // token.addEventListener("change", () => {
  //     if (token.value > 10) {
  //         chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
  //     }
  // })

  addSite.addEventListener("click", () => {
    const site = newSite.value.trim();
    if (site && !blockedSites.includes(site)) {
      blockedSites.push(site);
      chrome.storage.local.set({ blockedSites });
      addSiteToList(site);
      newSite.value = "";
    }
  });


  function addSiteToList(site) {
    const li = document.createElement("li");

    const siteInfo = document.createElement("div");
    siteInfo.style.display = "flex";
    siteInfo.style.alignItems = "center";
    siteInfo.style.gap = "10px";

    const siteName = document.createElement("span");
    siteName.textContent = site;

    const timeDisplay = document.createElement("span");
    timeDisplay.id = `time-${site.replace(/\./g, '-')}`;
    timeDisplay.style.fontSize = "12px";
    timeDisplay.style.color = "#666";
    timeDisplay.textContent = "0m";

    siteInfo.appendChild(siteName);
    siteInfo.appendChild(timeDisplay);

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


    li.appendChild(siteInfo);
    li.appendChild(removeBtn);
    siteList.appendChild(li);
  }

  async function updateTimeStats() {
    const { urlStats = {} } = await chrome.storage.local.get('urlStats');

    blockedSites.forEach(site => {
      const stats = urlStats[site] || { timeSpent: 0 };
    });
  }

  async function updateTimeDisplays() {
    const { urlStats = {} } = await chrome.storage.local.get('urlStats');

    blockedSites.forEach(site => {
      const timeElement = document.getElementById(`time-${site.replace(/\./g, '-')}`);
      if (timeElement) {
        const minutes = Math.floor((urlStats[site]?.timeSpent || 0) / 60);
        timeElement.textContent = `${minutes}m`;
      }
    });
  }

});
