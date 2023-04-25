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

// the order of these selectors must match the order of the keys in targetSelectors dict from content.js
const targetSelectors = [
    'toggleSignup', 
    'toggleVerif', 
    'toggleCheck',
];
    
document.addEventListener("DOMContentLoaded", () => {
    for(const key of targetSelectors){
        document.getElementById(key).addEventListener("click", () => {toggle(key)});
    }

    chrome.storage.sync.get(["isEnabled"], (result) => {
        if(result.isEnabled !== undefined){
            let num = 0;
            // iterate through isEnabled dict
            for(let key of targetSelectors){
                if(result.isEnabled[key]) num++;
            }
            updateIcon(num > 0);
            updateToggle(result.isEnabled);
        }
        else{
            updateIcon(true);
            let flagBySelector = {};
            for(const key of targetSelectors) flagBySelector[key] = true;
            updateToggle(flagBySelector);
            chrome.storage.sync.set({ isEnabled: flagBySelector });
        }
    });
});