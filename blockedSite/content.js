window.addEventListener("message", async (event) => {
  if (event.source !== window || event.data.type !== "FROM_EXTENSION") return;

  console.log("Received data from Chrome extension:", event.data);
  chrome.storage.local.set({timeOff: Number(event.data.data)});
  chrome.storage.local.set({redirectEnabled: false});

  // Example: Display received message in the webpage
  document.getElementById('status').textContent = "Received: " + event.data;
});