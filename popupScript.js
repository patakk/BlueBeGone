// popuScript.js

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

function updateToggle(isEnabled) {
  const toggle = document.getElementById("toggle");
  if (isEnabled) {
    toggle.textContent = "ON";
    toggle.style.backgroundColor = "#4cb34c";
    toggle.style.color = "#ffffff";
  } else {
    toggle.textContent = "OFF";
    toggle.style.backgroundColor = "#b34c4c";
    toggle.style.color = "#c8c8c8";
  }
}

async function toggle(){
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.sync.get(["isEnabled"], (result) => {
    const isEnabled = !result.isEnabled;
    chrome.storage.sync.set({ isEnabled: isEnabled }, () => {
      updateIcon(isEnabled);
      updateToggle(isEnabled);
      chrome.tabs.sendMessage(tab.id, { toggle: true, isEnabled: isEnabled });
    });
  });
}

document.getElementById("toggle").addEventListener("click", toggle);

chrome.storage.sync.get(["isEnabled"], (result) => {
  updateIcon(result.isEnabled);
  updateToggle(result.isEnabled);
});