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

function observeDOMChanges() {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          chrome.storage.sync.get(["isEnabled"], (result) => {
            if(result.isEnabled !== undefined){
                applyToggleState(result.isEnabled);
            }
            else{
                applyToggleState(true);
            }
          });
        }
      }
    });
  
    // const observerTarget = document.querySelector('header[role="banner"].css-1dbjc4n.r-obd0qt.r-16y2uox.r-lrvibr.r-1g40b8q');
    observer.observe(document.body, { childList: true, subtree: true });
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    applyToggleState(request.isEnabled);
});

window.onload = observeDOMChanges;

chrome.storage.sync.get(["isEnabled"], (result) => {
    if(result.isEnabled !== undefined){
        applyToggleState(result.isEnabled);
    }
    else{
        applyToggleState(true);
    }
});