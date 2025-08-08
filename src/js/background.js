/** background.js */


importScripts("user-data-manager.js");

let currentIconState = "inactive";
let flashInterval = null;

async function setIconState(state) {
    if (currentIconState === state) return;
    currentIconState = state;
    if (flashInterval) {
        clearInterval(flashInterval);
        flashInterval = null;
    }
    try {
        switch (state) {
            case "inactive":
                await chrome.action.setBadgeText({ text: "" });
                await chrome.action.setBadgeBackgroundColor({ color: "#888888" });
                await chrome.action.setTitle({ title: "Global Timezone & Location Spoofer - 未启用" });
                break;
            case "active":
                await chrome.action.setBadgeText({ text: "●" });
                await chrome.action.setBadgeBackgroundColor({ color: "#28a745" });
                await chrome.action.setTitle({ title: "Global Timezone & Location Spoofer - 已启用" });
                break;
            case "working":
                await chrome.action.setTitle({ title: "Global Timezone & Location Spoofer - 工作中" });
                let isAltChar = false;
                flashInterval = setInterval(async () => {
                    try {
                        if (isAltChar) {
                            await chrome.action.setBadgeText({ text: "◉" });
                            await chrome.action.setBadgeBackgroundColor({ color: "#00ff00" });
                        } else {
                            await chrome.action.setBadgeText({ text: "●" });
                            await chrome.action.setBadgeBackgroundColor({ color: "#28a745" });
                        }
                        isAltChar = !isAltChar;
                    } catch (e) {}
                }, 500);
                break;
        }
    } catch (e) {}
}

// 扩展安装或更新时触发
chrome.runtime.onInstalled.addListener(() => {
    console.log("MODIFIED: onInstalled triggered for Free Mode");
    setIconState("inactive");
    // MODIFIED: 强制将弹窗设置为功能页 popup.html
    chrome.action.setPopup({ popup: "popup.html" });
});

// 浏览器启动时触发
chrome.runtime.onStartup.addListener(() => {
    console.log("MODIFIED: onStartup triggered for Free Mode");
    setIconState("inactive");
    // MODIFIED: 同样设置弹窗为功能页
    chrome.action.setPopup({ popup: "popup.html" });
});

// 监听来自扩展其他部分的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "APPLY_PLUGIN_SETTINGS":
            applyPluginSettingsToAllTabs(message.cityData).then(() => {
                sendResponse({ success: true });
            });
            return true;
        case "PLUGIN_ACTIVATED":
            setIconState("active");
            sendResponse({ success: true });
            break;
        case "PLUGIN_DEACTIVATED":
            setIconState("inactive");
            sendResponse({ success: true });
            break;
        case "PLUGIN_WORKING":
            setIconState("working");
            sendResponse({ success: true });
            break;
        // MODIFIED: 其他认证相关的消息直接返回成功
        case "AUTH_STATUS_CHANGE":
        case "CHECK_AUTH_STATUS":
        case "DISABLE_PLUGIN_FOR_EXPIRED_USER":
        case "HANDLE_EXPIRED_USER":
        case "CLEAR_EXPIRED_USER_SETTINGS":
             console.log(`MODIFIED: Bypassing message type '${message.type}'`);
             sendResponse({ success: true });
             break;
    }
});

async function applyPluginSettingsToAllTabs(cityData) {
    try {
        await chrome.storage.sync.set({ selectedCity: cityData });
    } catch (error) {
        console.error("Failed to apply settings", error);
    }
}

// 监听 chrome.storage 的变化，将设置同步到所有页面
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.selectedCity) {
        const newCityData = changes.selectedCity.newValue;
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.id && tab.url && !tab.url.startsWith('chrome')) {
                    try {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: (key, value) => {
                                localStorage.setItem(key, JSON.stringify(value));
                                localStorage.removeItem("globalTimezoneSpoofer_fingerprint");
                            },
                            args: ["globalTimezoneSpoofer_selectedCity", newCityData]
                        }).catch(() => {});
                    } catch (e) {}
                }
            });
        });
    }
});