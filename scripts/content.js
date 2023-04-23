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

function applyToggleState(isEnabled) {
  if (isEnabled) {
    hideSpecifiedElement();
  } else {
    showSpecifiedElement();
  }
}

chrome.storage.sync.get(["isEnabled"], (result) => {
  observeDOMChanges(() => {
    applyToggleState(result.isEnabled);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggle) {
    applyToggleState(request.isEnabled);
  }
});

function observeDOMChanges(callback) {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        callback();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}