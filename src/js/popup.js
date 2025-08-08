/**popup.js */

// MODIFIED FOR FREE MODE

document.addEventListener("DOMContentLoaded", async function () {
    // --- DOM 元素获取 ---
    const regionCards = document.querySelectorAll(".region-card");
    const applyBtn = document.getElementById("apply-btn");
    const disableBtn = document.getElementById("disable-btn");
    const cleanAugmentBtn = document.getElementById("clean-augment-btn");
    const cleanStatusEl = document.getElementById("clean-status");
    const mailBtn = document.getElementById("mail-btn");
    const regionToggle = document.getElementById("region-toggle");
    const regionContent = document.getElementById("region-content");
    const authorText = document.getElementById("author-text");
    const currentLocationEl = document.getElementById("current-location");
    const currentTimeEl = document.getElementById("current-time");
    const currentDetailsEl = document.getElementById("current-details");
    const statusEl = document.getElementById("status");
    const loadingEl = document.getElementById("loading");

    // MODIFIED: 隐藏所有与付费账户相关的UI元素
    const userInfoEl = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");
    const buyDaysBtn = document.getElementById("buy-days-btn");
    const buyDaysModal = document.getElementById("buy-days-modal");
    if (userInfoEl) userInfoEl.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (buyDaysBtn) buyDaysBtn.style.display = 'none';
    if (buyDaysModal) buyDaysModal.style.display = 'none';

    let selectedRegionCode = null;
    
    const REGION_DATA = {
        US: { name: "美国", flag: "🇺🇸", timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"], locale: "en-US", country: "United States" },
        TW: { name: "台湾", flag: "🇹🇼", timezones: ["Asia/Taipei"], locale: "zh-TW", country: "Taiwan" },
        JP: { name: "日本", flag: "🇯🇵", timezones: ["Asia/Tokyo"], locale: "ja-JP", country: "Japan" },
        SG: { name: "新加坡", flag: "🇸🇬", timezones: ["Asia/Singapore"], locale: "en-SG", country: "Singapore" }
    };

    function updateRegionSelectionUI() {
        regionCards.forEach(card => {
            card.classList.remove("selected");
            if (card.dataset.region === selectedRegionCode) {
                card.classList.add("selected");
            }
        });
    }

    function updateCurrentLocationDisplay(settings) {
        if (settings && settings.selectedCity && settings.selectedRegion) {
            const regionInfo = REGION_DATA[settings.selectedRegion];
            if (regionInfo) {
                currentLocationEl.textContent = `${regionInfo.flag} ${settings.selectedCity.city}, ${settings.selectedCity.country}`;
                currentDetailsEl.textContent = `时区: ${settings.selectedCity.timezone} | 语言: ${settings.selectedCity.locale}`;
                statusEl.classList.add("active");
            }
        } else {
             currentLocationEl.textContent = "未设置";
             currentDetailsEl.textContent = "请选择一个地区并应用设置";
             statusEl.classList.remove("active");
        }
    }

    async function applySettings() {
        if (selectedRegionCode) {
            setLoading(true);
            try {
                await chrome.runtime.sendMessage({ type: "PLUGIN_WORKING" });
                
                const regionInfo = REGION_DATA[selectedRegionCode];
                const timezone = regionInfo.timezones[Math.floor(Math.random() * regionInfo.timezones.length)];
                const cityData = (function (regionCode, timezone, regionInfo) {
                    const cityList = { US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"], TW: ["Taipei", "Kaohsiung", "Taichung", "Tainan", "Taoyuan"], JP: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo"], SG: ["Singapore", "Jurong West", "Woodlands", "Tampines", "Sengkang"] }[regionCode];
                    const baseCoords = { US: { lat: 40.7128, lng: -74.006 }, TW: { lat: 25.033, lng: 121.5654 }, JP: { lat: 35.6762, lng: 139.6503 }, SG: { lat: 1.3521, lng: 103.8198 } }[regionCode];
                    return {
                        city: cityList[Math.floor(Math.random() * cityList.length)],
                        state: "US" === regionCode ? "NY" : regionInfo.name,
                        country: regionInfo.country,
                        country_code: regionCode,
                        timezone: timezone,
                        locale: regionInfo.locale,
                        lat: baseCoords.lat + 0.2 * (Math.random() - 0.5),
                        lng: baseCoords.lng + 0.2 * (Math.random() - 0.5)
                    };
                })(selectedRegionCode, timezone, regionInfo);

                await chrome.storage.sync.set({
                    selectedRegion: selectedRegionCode,
                    selectedCity: cityData,
                    lastUpdate: Date.now()
                });
                
                await chrome.runtime.sendMessage({ type: "APPLY_PLUGIN_SETTINGS", cityData: cityData });
                
                await new Promise(resolve => setTimeout(resolve, 500));
                updateCurrentLocationDisplay({ selectedRegion: selectedRegionCode, selectedCity: cityData });
                
                setLoading(false);
                showAppliedState(true);
                await chrome.runtime.sendMessage({ type: "PLUGIN_ACTIVATED" });

                if (confirm("设置已应用！是否刷新现有标签页以立即生效？")) {
                    const tabs = await chrome.tabs.query({url: ["http://*/*", "https://*/*"]});
                    for (const tab of tabs) {
                        if (tab.id) {
                            try { await chrome.tabs.reload(tab.id); } catch (e) {}
                        }
                    }
                }

            } catch (e) {
                console.error("Failed to apply settings:", e);
                alert("应用设置失败，请重试");
                setLoading(false);
            }
        } else {
            alert("请先选择一个地区");
        }
    }

    async function disablePlugin() {
        if (confirm('确定要停用插件功能吗？')) {
            setLoading(true);
            try {
                await chrome.storage.sync.remove(["selectedCity", "selectedRegion"]);
                await chrome.runtime.sendMessage({ type: "PLUGIN_DEACTIVATED" });
                showAppliedState(false);
                updateCurrentLocationDisplay({});
                setLoading(false);
                alert("插件功能已停用。所有页面的设置将在下次刷新或新开页面后清除。");
            } catch (e) {
                console.error("Failed to disable plugin:", e);
                alert("停用插件失败，请重试");
                setLoading(false);
            }
        }
    }

    function showAppliedState(isApplied) {
        if (isApplied) {
            applyBtn.textContent = "重新应用设置 / Reapply Settings";
            disableBtn.style.display = "inline-block";
        } else {
            applyBtn.textContent = "应用设置 / Apply Settings";
            disableBtn.style.display = "none";
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loadingEl.style.display = "block";
            applyBtn.disabled = true;
            disableBtn.disabled = true;
        } else {
            loadingEl.style.display = "none";
            applyBtn.disabled = false;
            disableBtn.disabled = false;
        }
    }

    function updateTimeDisplay() {
        const now = new Date();
        currentTimeEl.textContent = now.toLocaleTimeString("zh-CN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    async function cleanAugmentData() {
        try {
            showCleanStatus("正在清理Augment相关数据...", "progress");
            cleanAugmentBtn.disabled = true;
            const origins = { origins: ["https://*.augmentcode.com", "http://*.augmentcode.com", "https://*.augment.com", "http://*.augment.com", "https://augmentcode.com", "http://augmentcode.com", "https://augment.com", "http://augment.com"] };
            await chrome.browsingData.remove(origins, {
                cache: true,
                cookies: true,
                indexedDB: true,
                localStorage: true,
                webSQL: true
            });
            showCleanStatus("✅ Augment数据清理完成！", "success");
        } catch (e) {
            console.error("清理Augment数据失败:", e);
            showCleanStatus("❌ 清理失败，请重试", "error");
        } finally {
            setTimeout(() => { hideCleanStatus(); }, 3000);
            cleanAugmentBtn.disabled = false;
        }
    }

    function showCleanStatus(message, type) {
        cleanStatusEl.style.display = "block";
        cleanStatusEl.className = `clean-status ${type}`;
        cleanStatusEl.innerHTML = type === "progress" ? `<div class="clean-progress">${message}</div>` : `<div>${message}</div>`;
    }

    function hideCleanStatus() {
        cleanStatusEl.style.display = "none";
    }

    function openTutorial() {
        chrome.tabs.create({ url: "https://gogle.com" });
    }

    function openMail() {
        chrome.tabs.create({ url: "https://mail.googel.com" });
    }

    function toggleRegionContent() {
        regionContent.classList.toggle('collapsed');
        regionToggle.classList.toggle('collapsed');
        regionContent.classList.toggle('expanded');
    }

    function openLeakTestPage() {
        chrome.tabs.create({ url: "https://browserleaks.com/webrtc" });
    }

    // --- 初始化流程 ---
    async function initializePopup() {
        const settings = await chrome.storage.sync.get(["selectedRegion", "selectedCity"]);
        if (settings.selectedRegion) {
            selectedRegionCode = settings.selectedRegion;
            updateRegionSelectionUI();
            updateCurrentLocationDisplay(settings);
            showAppliedState(true);
        } else {
            selectedRegionCode = "US"; // 默认选择
            updateRegionSelectionUI();
            updateCurrentLocationDisplay({});
            showAppliedState(false);
        }

        regionCards.forEach(card => card.addEventListener("click", () => {
            selectedRegionCode = card.dataset.region;
            updateRegionSelectionUI();
        }));
        applyBtn.addEventListener("click", applySettings);
        disableBtn.addEventListener("click", disablePlugin);
        cleanAugmentBtn.addEventListener("click", cleanAugmentData);
        mailBtn.addEventListener("click", openMail);
        regionToggle.addEventListener("click", toggleRegionContent);
        authorText.addEventListener("dblclick", openLeakTestPage);

        updateTimeDisplay();
        setInterval(updateTimeDisplay, 1000);
    }

    initializePopup();
});