function updateIcon(isEnabled) {
    const path = isEnabled
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
    for(let k = 0; k < targetSelectors.length; k++){
        let key = targetSelectors[k];
        const toggle = document.getElementById(key);
        if (isEnabled[k]) {
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
    let keyidx = targetSelectors.indexOf(key);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.get(["isEnabled"], (result) => {
        result.isEnabled[keyidx] = !result.isEnabled[keyidx];
        
        let num = 0;
        for(let k = 0; k < result.isEnabled.length; k++){
            if(result.isEnabled[k]) num++;
        }
        updateIcon(num > 0);

        updateToggle(result.isEnabled);
        chrome.storage.sync.set({ isEnabled: result.isEnabled }, () => {
            chrome.tabs.sendMessage(tab.id, { isEnabled: result.isEnabled });
        });
    });
}

const targetSelectors = ['toggleSignup', 'toggleVerif', 'toggleCheck'];
    
document.addEventListener("DOMContentLoaded", () => {
    for(const key of targetSelectors){
        document.getElementById(key).addEventListener("click", () => {toggle(key)});
    }

    chrome.storage.sync.get(["isEnabled"], (result) => {
        if(result.isEnabled !== undefined){
            let num = 0;
            for(let k = 0; k < result.isEnabled.length; k++){
                if(result.isEnabled[k]) num++;
            }
            updateIcon(num > 0);
            updateToggle(result.isEnabled);
        }
        else{
            updateIcon(true);
            const trues = new Array(targetSelectors.length).fill(true);
            updateToggle(trues);
            chrome.storage.sync.set({ isEnabled: trues });
        }
    });
});