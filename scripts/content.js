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
    for(let key in selectors){
        if (isEnabled[key]) {
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
                        let flagBySelector = {};
                        for(const key in targetSelectors) flagBySelector[key] = true;
                        applyToggleState(flagBySelector, selectors);
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
        let flagBySelector = {};
        for(const key in targetSelectors) flagBySelector[key] = true;
        applyToggleState(flagBySelector, targetSelectors);
    }
});

