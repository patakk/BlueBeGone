// Allowed domains twitter.com and x.com
const allowedDomains = ["twitter.com", "x.com"];

// When the popup is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Load the visibility states and create the toggles
    // loadStatesAndCreateToggles();

    // Check the URL of the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTabUrl = tabs[0].url;

        // Check if the current tab's URL matches the allowed domains
        const isAllowedDomain = allowedDomains.some((domain) => {
            return currentTabUrl.indexOf(domain) !== -1;
        });

        // Load the visibility states and create the toggles
        loadStatesAndCreateToggles(isAllowedDomain);
    });
});

function loadStatesAndCreateToggles(isAllowedDomain) {
    chrome.storage.sync.get(null, (results) => {
        const container = document.body;

        for (let key in targets) {
            const target = targets[key];

            // Create the toggle for this target
            const div = document.createElement("div");

            const labelText = document.createElement("span");
            labelText.textContent = target.title;

            const switchLabel = document.createElement("label");
            switchLabel.classList.add("switch");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            const slider = document.createElement("span");
            slider.classList.add("slider", "round");

            // If we have a stored state for this target, set the toggle state
            if (results[key] !== undefined) {
                checkbox.checked = results[key]; // Since true means visible and checked means visible
            } else {
                checkbox.checked = true;
            }

            // Disable the toggle if it's not an allowed domain
            if (!isAllowedDomain) {
                checkbox.disabled = true;
            } else {
                // Update the state in storage and send message to content script whenever the toggle is switched
                checkbox.addEventListener("change", function() {
                    storeVisibilityState(key, this.checked);

                    // Send message to content script to immediately update visibility
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "toggleVisibility",
                            targetKey: key,
                            isVisible: this.checked
                        });
                    }.bind(this));
                });
            }

            switchLabel.appendChild(checkbox);
            switchLabel.appendChild(slider);
            div.appendChild(labelText);
            div.appendChild(switchLabel);
            container.appendChild(div);
        }
    });
}


function storeVisibilityState(targetKey, isVisible) {
    chrome.storage.sync.set({ [targetKey]: isVisible });
}