importScripts("./config.js");

let tabIds = {};
let windowId = 0;

chrome.action.onClicked.addListener(async (activeTab) => {
  chrome.windows.get(windowId, (window) => {
    if (!chrome.runtime.lastError && window) {
      chrome.windows.update(windowId, {focused: true});
      return;
    }

    chrome.windows.create(
      {"url": "index.html"},
      (newWindow) => {
        windowId = newWindow.id;
      }
    );
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.query({}, async (tabs) => {
    let currentTabs = {};
    const keyword = request.keyword;
    const genre = request.genre;
    const targetSites = request.sites;
  
    for (let i = 0; i<tabs.length; i++) {
      const tab = tabs[i];   
      currentTabs[tab.id] = tab;
    }

    // siteConfigsはグローバル変数
    for (let i=0; i<siteConfigs.length; i++) {
      const config = siteConfigs[i];

      if (!targetSites.includes(config.id)) {
        continue;
      }

      const url = config.getSearchUrl(keyword, genre);
      if (config.id in tabIds) {
        const tabId = tabIds[config.id];
        const tab = currentTabs[tabId];
        if (tabId in currentTabs) {
          const tab = currentTabs[tabId];
          chrome.tabs.update(tabId, {url: url}); 
          continue;
        }
      }

      const tab = await chrome.tabs.create({url: url, active: false});
      tabIds[config.id] = tab.id;
    }
  });
  sendResponse({
    "amazon": "opened" 
  });
});
