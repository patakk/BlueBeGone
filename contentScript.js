// contentScript.js

function hideSpecifiedElement() {
  const targetSelector = 'a[href="/i/twitter_blue_sign_up"][role="link"], a[href="/i/verified-orgs-signup"][role="link"]';
  const twitterElements = document.querySelectorAll(targetSelector);

  for (const element of twitterElements) {
    element.style.display = "none";
  }
}

function showSpecifiedElement() {
  const targetSelector = 'a[href="/i/twitter_blue_sign_up"][role="link"], a[href="/i/verified-orgs-signup"][role="link"]';
  const twitterElements = document.querySelectorAll(targetSelector);

  for (const element of twitterElements) {
    element.style.display = "";
  }
}

chrome.storage.sync.get(["isEnabled"], (result) => {
  if (result.isEnabled) {
    hideSpecifiedElement();
  } else {
    showSpecifiedElement();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggle) {
    if (request.isEnabled) {
      hideSpecifiedElement();
    } else {
      showSpecifiedElement();
    }
  }
});

