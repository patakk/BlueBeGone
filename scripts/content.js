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

// Observe DOM changes and apply the hiding logic
function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        hideAllSpecifiedElements(targetSelectors);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Apply hiding logic once the page loads
window.onload = () => {
    hideAllSpecifiedElements(targetSelectors);
    observeDOMChanges();  // Start observing for DOM changes
};