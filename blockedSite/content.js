window.addEventListener("message", async (event) => {
  if (event.source !== window || event.data.type !== "FROM_WEB_APP") return;

  console.log("Received data from Chrome extension:", event.data);
  chrome.storage.local.set({timeOff: Number(event.data.data)});
  chrome.storage.local.set({redirectEnabled: false});
  const url = await chrome.storage.local.get("originalUrl")

  // Example: Display received message in the webpage
  document.getElementById('status').textContent = "Received: " + event.data.data;
  window.postMessage({ type: "FROM_EXT", url: `${url.originalUrl}` }, "http://localhost:63342/EarnIt/website/index.html?_ijt=ndh1kupicnstgaro90vc20jl5k");
});