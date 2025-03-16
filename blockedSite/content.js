window.addEventListener("message", async (event) => {
  if (event.source !== window || event.data.type !== "FROM_WEB_APP") return;

  chrome.storage.local.set({timeLimit: Number(event.data.data)});
  chrome.storage.local.set({redirectEnabled: false});

  chrome.runtime.sendMessage({ action: "redirectBack", timeLimit: event.data.data, startTime: Date.now() }, (response) => {
    console.log("Message sent to background.js:", response);
  });
});