// Targets
const targets = {
    'toggleSignup': {
        'selector': 'a[href="/i/verified-choose"][role="link"]',
        'title': 'Hide Signup',
        'description': 'Hide the signup button for Twitter verification',
    },
    'toggleCheck': {
        'selector': 'svg[data-testid="icon-verified"]',
        'title': 'Hide Checkmarks',
        'description': 'Hide the checkmarks for verified Twitter accounts',
    },
};

// Extract the selectors from the targets
const targetSelectors = Object.values(targets).map(target => target.selector);

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