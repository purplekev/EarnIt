document.addEventListener("DOMContentLoaded", async () => {
    const toggleRedirect = document.getElementById("toggleRedirect");
    const siteList = document.getElementById("siteList");
    const newSite = document.getElementById("newSite");
    const addSite = document.getElementById("addSite");
    const token = document.getElementById("token");
    const addToken = document.getElementById("addToken")

    // Load saved data
    const { blockedSites = [], redirectEnabled = true, redirectDisabled = false } = await chrome.storage.local.get();

    // Populate UI
    toggleRedirect.checked = redirectEnabled;
    toggleRedirect.unchecked = redirectDisabled
    blockedSites.forEach((site) => addSiteToList(site));

    // Toggle redirect on/off
    toggleRedirect.addEventListener("change", () => {
      chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
    });

    // Event listener for the button click
    addToken.addEventListener("click", () => {
        let tokenValue = Number(token.value) + 1;  // Use token.value to get the current value

        // Update the displayed token count
        token.value = tokenValue;  // Set token.value instead of tokenInput.value

        // Check if token count exceeds 10
        if (tokenValue >= 1) {
            toggleRedirect.checked = false;
            chrome.storage.local.set({ redirectEnabled: false });
        }
    });

    // token.addEventListener("change", () => {
    //     if (token.value > 10) {
    //         chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
    //     }
    // })

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

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.token > 10) {
          // Perform the desired action in your extension
          console.log('Token is greater than 10:', message.token);
          
          // Example: Change something in the extension
          // (could be UI updates, setting a flag, etc.)
          chrome.storage.local.set({ 'tokenStatus': 'active' });
  
          // Send response back if needed
          sendResponse({ status: 'success' });
      } else {
          sendResponse({ status: 'token too low' });
      }
      // Keep the message channel open until response is sent
      return true;
    });
  
    
  });
  