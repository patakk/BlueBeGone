function hideSpecifiedElements(selector) {
    const elements = document.querySelectorAll(selector);
    console.log('hide', elements)
    for (const element of elements) {
        element.style.display = "none";
    }
}

function showSpecifiedElements(selector) {
    const elements = document.querySelectorAll(selector);
    console.log('show', elements)
    for (const element of elements) {
        element.style.display = "";
    }
}

function applyToggleState(isEnabled, selectors) {
    for(let k = 0; k < Object.keys(selectors).length; k++){
        let key = Object.keys(selectors)[k];
        if (isEnabled[k]) {
            console.log(k, key, isEnabled[k], selectors[key])
            hideSpecifiedElements(selectors[key]);
        } else {
            showSpecifiedElements(selectors[key]);
        }
    }
}

function observeDOMChanges(selectors) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                chrome.storage.sync.get(["isEnabled"], (result) => {
                    if (result.isEnabled !== undefined) {
                        applyToggleState(result.isEnabled, selectors);
                    } else {
                        applyToggleState(new Array(Object.keys(selectors).length).fill(true), selectors);
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Add target selectors to this array
const targetSelectors = {
    'toggleSignup': 'a[href="/i/twitter_blue_sign_up"][role="link"]', // Twitter Blue signup
    'toggleVerif': 'a[href="/i/verified-orgs-signup"][role="link"]', // Verified Orgs signup
    'toggleCheck': 'svg[data-testid="icon-verified"]', // Verified badge
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    applyToggleState(request.isEnabled, targetSelectors);
});

window.onload = () => observeDOMChanges(targetSelectors);


chrome.storage.sync.get(["isEnabled"], (result) => {
    if (result.isEnabled !== undefined) {
        applyToggleState(result.isEnabled, targetSelectors);
    } else {
        applyToggleState(new Array(Object.keys(targetSelectors).length).fill(true), targetSelectors);
    }
});

