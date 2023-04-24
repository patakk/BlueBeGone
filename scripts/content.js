function hideSpecifiedElements(targetSelectors) {
    for (const targetSelector of targetSelectors) {
        const elements = document.querySelectorAll(targetSelector);

        for (const element of elements) {
            element.style.display = "none";
        }
    }
}

function showSpecifiedElements(targetSelectors) {
    for (const targetSelector of targetSelectors) {
        const elements = document.querySelectorAll(targetSelector);

        for (const element of elements) {
            element.style.display = "";
        }
    }
}

function applyToggleState(isEnabled, targetSelectors) {
    if (isEnabled) {
        hideSpecifiedElements(targetSelectors);
    } else {
        showSpecifiedElements(targetSelectors);
    }
}

function observeDOMChanges(targetSelectors) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                chrome.storage.sync.get(["isEnabled"], (result) => {
                    if (result.isEnabled !== undefined) {
                        applyToggleState(result.isEnabled, targetSelectors);
                    } else {
                        applyToggleState(true, targetSelectors);
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    applyToggleState(request.isEnabled, targetSelectors);
});

window.onload = () => observeDOMChanges(targetSelectors);

chrome.storage.sync.get(["isEnabled"], (result) => {
    if (result.isEnabled !== undefined) {
        applyToggleState(result.isEnabled, targetSelectors);
    } else {
        applyToggleState(true, targetSelectors);
    }
});

// Add target selectors to this array
const targetSelectors = [
    'a[href="/i/twitter_blue_sign_up"][role="link"]', // Twitter Blue signup
    'a[href="/i/verified-orgs-signup"][role="link"]', // Verified Orgs signup
    'svg[data-testid="icon-verified"]', // Verified badge
];