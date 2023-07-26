// Extract the selectors from the targets
const targetSelectors = Object.values(targets).map(target => target.selector);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleVisibility" && targets[request.targetKey]) {
        if (request.isVisible) {
            hideAllSpecifiedElements(targets[request.targetKey].selector);
        } else {
            // Assuming you have a function to show the elements, or you can modify the `hideAllSpecifiedElements` to make it toggle visibility.
            showAllSpecifiedElements(targets[request.targetKey].selector);
        }
    }
});

function showAllSpecifiedElements(selector) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
        element.style.display = "";
    }
}


function hideAllSpecifiedElements(selector) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
        element.style.display = "none";
    }
}

function storeVisibilityState(targetKey, isVisible) {
    chrome.storage.sync.set({ [targetKey]: isVisible });
}

function applyStoredVisibility() {
    chrome.storage.sync.get(null, (results) => {
        for (let key in results) {
            if (targets[key]) {
                if (results[key]) {
                    hideAllSpecifiedElements(targets[key].selector);
                }
            }
        }
    });
}

function initializeStorage() {
    chrome.storage.sync.get(null, (results) => {
        for (let key in targets) {
            if (results[key] === undefined) {
                storeVisibilityState(key, true);
            }
        }
    });
}

// Observe DOM changes and apply the hiding logic
function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        applyStoredVisibility();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize
window.onload = () => {
    initializeStorage();
    applyStoredVisibility();
    observeDOMChanges();
};