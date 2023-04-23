function updateIcon(isEnabled) {
    const path = isEnabled
      ? {
          "16": "icon16.png",
          "48": "icon48.png",
          "128": "icon128.png",
        }
      : {
          "16": "icon_gray16.png",
          "48": "icon_gray48.png",
          "128": "icon_gray128.png",
        };
  
    chrome.action.setIcon({ path: path });
  }
  
  document.getElementById("toggle").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.storage.sync.get(["isEnabled"], (result) => {
      const isEnabled = !result.isEnabled;
      chrome.storage.sync.set({ isEnabled: isEnabled }, () => {
        updateIcon(isEnabled);
        chrome.tabs.sendMessage(tab.id, { toggle: true, isEnabled: isEnabled });
      });
    });
  });
  
  chrome.storage.sync.get(["isEnabled"], (result) => {
    updateIcon(result.isEnabled);
  });