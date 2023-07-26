function updateIcon(flag) {
    const path = flag
    ? {
        "16": "../assets/icon16.png",
        "48": "../assets/icon48.png",
        "128": "../assets/icon128.png",
    }
    : {
        "16": "../assets/icon_gray16.png",
        "48": "../assets/icon_gray48.png",
        "128": "../assets/icon_gray128.png",
    };
    
    chrome.action.setIcon({ path: path });
}

function updateToggle(isEnabled) {
    for(let key in isEnabled){
        const toggle = document.getElementById(key);
        if (isEnabled[key]) {
            toggle.textContent = "hidden";
            toggle.style.backgroundColor = "#6cb36c";
            toggle.style.color = "#ffffff";
        } else {
            toggle.textContent = "shown";
            toggle.style.backgroundColor = "#1d9bf0";
            toggle.style.color = "#ffffff";
        }
    }
}

async function toggle(key){
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.get(["isEnabled"], (result) => {
        result.isEnabled[key] = !result.isEnabled[key];
        
        let num = 0;
        for(let key in result.isEnabled){
            if(result.isEnabled[key]) num++;
        }
        updateIcon(num > 0);

        updateToggle(result.isEnabled);
        chrome.storage.sync.set({ isEnabled: result.isEnabled }, () => {
            chrome.tabs.sendMessage(tab.id, { isEnabled: result.isEnabled });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Gets the isEnabled dict from storage
    chrome.storage.sync.get(["isEnabled"], (result) => {
        const isEnabledDict = result.isEnabled || {}; // Default to an empty object if not set
        
        // Iterate through targets dict
        for(const target in targets) {
            const targetElement = document.getElementById(target);

            // Initialize the display state
            if (isEnabledDict[target]) {
                targetElement.textContent = "visible"; // or whatever representation you use for "enabled"
            } else {
                targetElement.textContent = "hidden"; // or whatever representation you use for "disabled"
            }

            // Add event listener for toggling
            targetElement.addEventListener("click", () => {
                // Toggle state
                isEnabledDict[target] = !isEnabledDict[target];
                
                // Update display state
                if (isEnabledDict[target]) {
                    targetElement.textContent = "visible";
                } else {
                    targetElement.textContent = "hidden";
                }

                // Save the updated isEnabled dictionary back to storage
                chrome.storage.sync.set({ "isEnabled": isEnabledDict });
            });
        }
    });
});


function generatePopupContent() {
    const mainDiv = document.createElement('div');
    mainDiv.id = "main";

    // Adding the header
    const header = document.createElement('h2');
    header.textContent = 'BlueBeGone';
    mainDiv.appendChild(header);

    const description = document.createElement('p');
    description.id = 'description';
    description.textContent = 'Hides some of Twitter\'s annoyances.';
    mainDiv.appendChild(description);

    for (const key in targets) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        const titleDiv = document.createElement('div');
        titleDiv.textContent = targets[key].title;

        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'toggle';
        toggleDiv.id = key;
        toggleDiv.textContent = 'hidden';

        rowDiv.appendChild(titleDiv);
        rowDiv.appendChild(toggleDiv);

        mainDiv.appendChild(rowDiv);
    }

    document.body.appendChild(mainDiv);
}

generatePopupContent();