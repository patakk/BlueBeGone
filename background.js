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
  
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ isEnabled: false }, () => {
        updateIcon(false);
    });
});
