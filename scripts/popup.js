// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.createElement('div');
//     container.className = 'settings-container';

//     for (const key in targets) {
//         if (targets.hasOwnProperty(key)) {
//             const target = targets[key];

//             // Create elements for each target
//             const section = document.createElement('div');
//             section.className = 'settings-section';

//             const label = document.createElement('label');
//             label.className = 'settings-label';
//             label.innerHTML = target.title;

//             const description = document.createElement('p');
//             description.className = 'settings-description';
//             description.innerText = target.description;

//             const toggle = document.createElement('input');
//             toggle.type = 'checkbox';
//             toggle.className = 'settings-toggle';
//             toggle.id = key;

//             // Load current settings and set the state of the toggle
//             chrome.storage.sync.get(["isEnabled"], (result) => {
//                 if (result.isEnabled && result.isEnabled[key] !== undefined) {
//                     toggle.checked = result.isEnabled[key];
//                 }
//             });

//             // Listen for toggle change events
//             toggle.addEventListener('change', (e) => {
//                 const isEnabled = e.target.checked;
//                 updateSetting(key, isEnabled);
//             });

//             section.appendChild(label);
//             section.appendChild(description);
//             section.appendChild(toggle);
//             container.appendChild(section);
//         }
//     }

//     document.body.appendChild(container);
// });

// function updateSetting(key, isEnabled) {
//     chrome.storage.sync.get(["isEnabled"], (result) => {
//         let settings = result.isEnabled || {};
//         settings[key] = isEnabled;

//         chrome.storage.sync.set({ "isEnabled": settings }, () => {
//             // Notify the content script to apply the changes
//             chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//                 chrome.tabs.sendMessage(tabs[0].id, { isEnabled: settings });
//             });
//         });
//     });
// }
