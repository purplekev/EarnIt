document.addEventListener("DOMContentLoaded", async () => {

  const recommendedList = document.getElementById("recommendedSites");
  const disableRequestBtn = document.getElementById("disableRequest");

  const toggleRedirect = document.getElementById("toggleRedirect");
  const siteList = document.getElementById("siteList");
  const newSite = document.getElementById("newSite");
  const addSite = document.getElementById("addSite");
  const productiveSiteList = document.getElementById("productiveSiteList");
  const productiveSiteInput = document.getElementById("productiveSiteInput");
  const addProductiveSite = document.getElementById("addProductiveSiteBtn");

  // Load saved data
  const {
    blockedSites = [],
    redirectEnabled = true,
    redirectDisabled = false,
    timeOff = 0,
    productiveSites = [],

    accountabilityEmail = null,
    disableRequestPending = false
  } = await chrome.storage.local.get();

  // Populate UI
  toggleRedirect.checked = redirectEnabled;
  toggleRedirect.unchecked = redirectDisabled
  blockedSites.forEach((site) => addSiteToList(site));
  productiveSites.forEach((site) => addProductiveSiteToList(site));

  // Toggle redirect on/off
  toggleRedirect.addEventListener("change", () => {
    chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
  });

  setInterval(updateTimeDisplays, 5000);


    // const recommendedList = document.getElementById("recommendedSites");

    chrome.runtime.sendMessage({ action: "analyzeHistory" });

// Fetch recommended sites from storage and display them
chrome.storage.local.get("recommendedBlockedSites", (data) => {
  recommendedList.innerHTML = ""; // Clear previous recommendations

  if (data.recommendedBlockedSites && data.recommendedBlockedSites.length > 0) {
      let totalVisits = data.recommendedBlockedSites.reduce((sum, [, count]) => sum + count, 0);

      data.recommendedBlockedSites.forEach(([domain, count]) => {
          let listItem = document.createElement("li");
          let percentage = ((count / totalVisits) * 100).toFixed(1); // Convert to percentage

          listItem.textContent = `${domain} (${percentage}%)`;

          // Check if site is already blocked
          chrome.storage.local.get("blockedSites", (blockedData) => {
              let blockedSites = blockedData.blockedSites || [];
              if (blockedSites.includes(`${domain}`)) {
                  listItem.style.color = "gray";  // Already blocked
                  listItem.textContent = `${domain} (Blocked)`;
              } else {
                  listItem.style.cursor = "pointer";
                  listItem.style.textDecoration = "underline"; // Indicate it's clickable
                  listItem.style.color = "blue"; // Make it look like a link

                  listItem.onclick = () => {
                      blockSite(domain);
                      listItem.style.color = "gray"; // Change color after being clicked
                      listItem.textContent = `${domain} (Blocked)`;
                  };
              }

              recommendedList.appendChild(listItem);
          });
      });
  } else {
      recommendedList.innerHTML = "<li>No recommendations yet.</li>";
  }
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
    const {urlStats = {}} = await chrome.storage.local.get('urlStats');

    blockedSites.forEach(site => {
      const timeElement = document.getElementById(`time-${site.replace(/\./g, '-')}`);
      if (timeElement) {
        const minutes = Math.floor((urlStats[site]?.timeSpent || 0) / 60);
        timeElement.textContent = `${minutes}m`;
      }
    });
  }

  // If there's a pending request, update UI accordingly
  if (disableRequestPending) {
    disableRequestBtn.textContent = "Request Pending...";
    disableRequestBtn.disabled = true;
  }

  disableRequestBtn.addEventListener("click", async () => {
    // Set the pending flag
    await chrome.storage.local.set({ disableRequestPending: true });

    // Update button state
    disableRequestBtn.textContent = "Request Pending...";
    disableRequestBtn.disabled = true;
  });

  // Modify the email display function
  function displayAccountabilityEmail(email) {
    const storedEmailDisplay = document.getElementById("storedEmail");
    storedEmailDisplay.textContent = email || "No partner added";
  }

  // Add event listener for the accountability button
  document.getElementById("add-accountability").addEventListener("click", () => {
    const email = document.getElementById("newEmail").value.trim();
    if (email) {
      chrome.storage.local.set({accountabilityEmail: email});
      displayAccountabilityEmail(email);
      document.getElementById("newEmail").value = "";
    }
  });


  // Add productive site
  addProductiveSite.addEventListener("click", () => {
    const site = productiveSiteInput.value.trim();
    if (site && !productiveSites.includes(site)) {
      productiveSites.push(site);
      chrome.storage.local.set({ productiveSites });
      addProductiveSiteToList(site);
      productiveSiteInput.value = "";
    }
  });

  // Add productive site to UI with remove button
  function addProductiveSiteToList(site) {
    const li = document.createElement("li");
    li.textContent = site;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      const index = productiveSites.indexOf(site);
      if (index > -1) {
        productiveSites.splice(index, 1);
        chrome.storage.local.set({ productiveSites });
        li.remove();
      }
    });
    li.appendChild(removeBtn);
    productiveSiteList.appendChild(li);
  }
});
