document.addEventListener("DOMContentLoaded", async () => {
  const toggleRedirect = document.getElementById("toggleRedirect");
  const siteList = document.getElementById("siteList");
  const newSite = document.getElementById("newSite");
  const addSite = document.getElementById("addSite");
  const token = document.getElementById("token");
  const addToken = document.getElementById("addToken")
  const disableRequestBtn = document.getElementById("disableRequest");
  const storedEmailDisplay = document.getElementById("storedEmail");
  const emailList = document.getElementById("emailList");

  // Load saved data
  const {
    blockedSites = [],
    redirectEnabled = true,
    redirectDisabled = false,
    accountabilityEmail = null,
    disableRequestPending = false
  } = await chrome.storage.local.get();

  // Populate UI
  toggleRedirect.checked = redirectEnabled;
  toggleRedirect.unchecked = redirectDisabled
  blockedSites.forEach((site) => addSiteToList(site));

  // Toggle redirect on/off
  toggleRedirect.addEventListener("change", () => {
    chrome.storage.local.set({ redirectEnabled: toggleRedirect.checked });
  });

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

  // // popup.js
  // document.getElementById('addToken').addEventListener('click', () => {
  //   chrome.runtime.sendMessage({ type: 'messageToWebApp', data: 'Hello from extension!' });
  // });


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

    // Here you would add your email sending logic
    // When response is received from accountability partner:
    // await chrome.storage.local.set({ disableRequestPending: false });
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
      chrome.storage.local.set({ accountabilityEmail: email });
      displayAccountabilityEmail(email);
      document.getElementById("newEmail").value = "";
    }
  });

  // // Display existing email if any when popup opens
  // if (accountabilityEmail) {
  //   displayAccountabilityEmail(accountabilityEmail);
  // }

});


