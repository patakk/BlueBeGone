function updateIcon(isEnabled) {
    const path = isEnabled
      ? {
        "16": "../assets/icon16.png",
        "48": "../assets/icon48.png",
        "128": "../assets/icon128.png",
      }
    : {
        "16": "../assets/icon_gray16.png",
        "48": "../assets/icon_gray48.png",
        "128": "../assets/icon_gray128.png",
      };
  
    chrome.action.setIcon({ path: path });
  }
  
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ isEnabled: true }, () => {
        updateIcon(true);
    });
});
