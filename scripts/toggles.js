// When the popup is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Load the visibility states and create the toggles
    loadStatesAndCreateToggles();
});

function loadStatesAndCreateToggles() {
    chrome.storage.sync.get(null, (results) => {
        const container = document.body;

        for (let key in targets) {
            const target = targets[key];
            
            // Create the toggle for this target
            const div = document.createElement("div");
            
            const label = document.createElement("label");
            label.textContent = target.title;
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            
            // Adjusted logic: true (hidden) in storage means unchecked in UI
            if (results[key] !== undefined) {
                checkbox.checked = results[key]; 
            } else {
                checkbox.checked = false;
            }

            // Update the state in storage and send message to content script whenever the checkbox is toggled
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

            label.prepend(checkbox);
            div.appendChild(label);
            container.appendChild(div);
        }
    });
}

function storeVisibilityState(targetKey, isVisible) {
    chrome.storage.sync.set({ [targetKey]: isVisible });
}