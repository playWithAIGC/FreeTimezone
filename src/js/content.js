(function () {
    "use strict";

    // MODIFIED: 移除了入口处的用户检查
    if (window.WEBRTC_INTERCEPTOR_LOADED) return;
    window.WEBRTC_INTERCEPTOR_LOADED = true;
    console.log("MODIFIED: Content Script Loaded (Free Mode)");
    
    const cityDataByTimezone = {
        "America/New_York": [{ city: "New York", state: "NY", country: "United States", country_code: "US", lat: 40.7128, lng: -74.006, locale: "en-US" }, { city: "Boston", state: "MA", country: "United States", country_code: "US", lat: 42.3601, lng: -71.0589, locale: "en-US" }, { city: "Philadelphia", state: "PA", country: "United States", country_code: "US", lat: 39.9526, lng: -75.1652, locale: "en-US" }, { city: "Atlanta", state: "GA", country: "United States", country_code: "US", lat: 33.749, lng: -84.388, locale: "en-US" }, { city: "Miami", state: "FL", country: "United States", country_code: "US", lat: 25.7617, lng: -80.1918, locale: "en-US" }, { city: "Washington", state: "DC", country: "United States", country_code: "US", lat: 38.9072, lng: -77.0369, locale: "en-US" }, { city: "Charlotte", state: "NC", country: "United States", country_code: "US", lat: 35.2271, lng: -80.8431, locale: "en-US" }, { city: "Jacksonville", state: "FL", country: "United States", country_code: "US", lat: 30.3322, lng: -81.6557, locale: "en-US" }],
        "America/Chicago": [{ city: "Chicago", state: "IL", country: "United States", country_code: "US", lat: 41.8781, lng: -87.6298, locale: "en-US" }, { city: "Houston", state: "TX", country: "United States", country_code: "US", lat: 29.7604, lng: -95.3698, locale: "en-US" }, { city: "Dallas", state: "TX", country: "United States", country_code: "US", lat: 32.7767, lng: -96.797, locale: "en-US" }, { city: "San Antonio", state: "TX", country: "United States", country_code: "US", lat: 29.4241, lng: -98.4936, locale: "en-US" }, { city: "Austin", state: "TX", country: "United States", country_code: "US", lat: 30.2672, lng: -97.7431, locale: "en-US" }, { city: "Minneapolis", state: "MN", country: "United States", country_code: "US", lat: 44.9778, lng: -93.265, locale: "en-US" }, { city: "Kansas City", state: "MO", country: "United States", country_code: "US", lat: 39.0997, lng: -94.5786, locale: "en-US" }, { city: "Nashville", state: "TN", country: "United States", country_code: "US", lat: 36.1627, lng: -86.7816, locale: "en-US" }],
        "America/Denver": [{ city: "Denver", state: "CO", country: "United States", country_code: "US", lat: 39.7392, lng: -104.9903, locale: "en-US" }, { city: "Phoenix", state: "AZ", country: "United States", country_code: "US", lat: 33.4484, lng: -112.074, locale: "en-US" }, { city: "Salt Lake City", state: "UT", country: "United States", country_code: "US", lat: 40.7608, lng: -111.891, locale: "en-US" }, { city: "Albuquerque", state: "NM", country: "United States", country_code: "US", lat: 35.0844, lng: -106.6504, locale: "en-US" }, { city: "Colorado Springs", state: "CO", country: "United States", country_code: "US", lat: 38.8339, lng: -104.8214, locale: "en-US" }, { city: "Mesa", state: "AZ", country: "United States", country_code: "US", lat: 33.4152, lng: -111.8315, locale: "en-US" }, { city: "Tucson", state: "AZ", country: "United States", country_code: "US", lat: 32.2226, lng: -110.9747, locale: "en-US" }],
        "America/Los_Angeles": [{ city: "Los Angeles", state: "CA", country: "United States", country_code: "US", lat: 34.0522, lng: -118.2437, locale: "en-US" }, { city: "San Francisco", state: "CA", country: "United States", country_code: "US", lat: 37.7749, lng: -122.4194, locale: "en-US" }, { city: "Seattle", state: "WA", country: "United States", country_code: "US", lat: 47.6062, lng: -122.3321, locale: "en-US" }, { city: "San Diego", state: "CA", country: "United States", country_code: "US", lat: 32.7157, lng: -117.1611, locale: "en-US" }, { city: "Las Vegas", state: "NV", country: "United States", country_code: "US", lat: 36.1699, lng: -115.1398, locale: "en-US" }, { city: "Portland", state: "OR", country: "United States", country_code: "US", lat: 45.5152, lng: -122.6784, locale: "en-US" }, { city: "Sacramento", state: "CA", country: "United States", country_code: "US", lat: 38.5816, lng: -121.4944, locale: "en-US" }, { city: "San Jose", state: "CA", country: "United States", country_code: "US", lat: 37.3382, lng: -121.8863, locale: "en-US" }],
        "Asia/Taipei": [{ city: "Taipei", state: "Taipei City", country: "Taiwan", country_code: "TW", lat: 25.033, lng: 121.5654, locale: "zh-TW" }, { city: "Kaohsiung", state: "Kaohsiung City", country: "Taiwan", country_code: "TW", lat: 22.6273, lng: 120.3014, locale: "zh-TW" }, { city: "Taichung", state: "Taichung City", country: "Taiwan", country_code: "TW", lat: 24.1477, lng: 120.6736, locale: "zh-TW" }, { city: "Tainan", state: "Tainan City", country: "Taiwan", country_code: "TW", lat: 22.9999, lng: 120.2269, locale: "zh-TW" }, { city: "Taoyuan", state: "Taoyuan City", country: "Taiwan", country_code: "TW", lat: 24.9936, lng: 121.301, locale: "zh-TW" }],
        "Asia/Tokyo": [{ city: "Tokyo", state: "Tokyo", country: "Japan", country_code: "JP", lat: 35.6762, lng: 139.6503, locale: "ja-JP" }, { city: "Osaka", state: "Osaka", country: "Japan", country_code: "JP", lat: 34.6937, lng: 135.5023, locale: "ja-JP" }, { city: "Yokohama", state: "Kanagawa", country: "Japan", country_code: "JP", lat: 35.4437, lng: 139.638, locale: "ja-JP" }, { city: "Nagoya", state: "Aichi", country: "Japan", country_code: "JP", lat: 35.1815, lng: 136.9066, locale: "ja-JP" }, { city: "Sapporo", state: "Hokkaido", country: "Japan", country_code: "JP", lat: 43.0642, lng: 141.3469, locale: "ja-JP" }, { city: "Fukuoka", state: "Fukuoka", country: "Japan", country_code: "JP", lat: 33.5904, lng: 130.4017, locale: "ja-JP" }, { city: "Kobe", state: "Hyogo", country: "Japan", country_code: "JP", lat: 34.6901, lng: 135.1956, locale: "ja-JP" }, { city: "Kyoto", state: "Kyoto", country: "Japan", country_code: "JP", lat: 35.0116, lng: 135.7681, locale: "ja-JP" }],
        "Asia/Singapore": [{ city: "Singapore", state: "Singapore", country: "Singapore", country_code: "SG", lat: 1.3521, lng: 103.8198, locale: "en-SG" }, { city: "Jurong West", state: "Singapore", country: "Singapore", country_code: "SG", lat: 1.3404, lng: 103.709, locale: "en-SG" }, { city: "Woodlands", state: "Singapore", country: "Singapore", country_code: "SG", lat: 1.4382, lng: 103.789, locale: "en-SG" }, { city: "Tampines", state: "Singapore", country: "Singapore", country_code: "SG", lat: 1.3496, lng: 103.9568, locale: "en-SG" }, { city: "Sengkang", state: "Singapore", country: "Singapore", country_code: "SG", lat: 1.3868, lng: 103.8914, locale: "en-SG" }]
    };
    
    let spoofedTimezone, selectedCityData;
    const FINGERPRINT_STORAGE_KEY = "globalTimezoneSpoofer_fingerprint";
    const storedCityJSON = localStorage.getItem("globalTimezoneSpoofer_selectedCity");
    
    let fingerprintData;
    const storedFingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);

    if (storedCityJSON) {
        try {
            selectedCityData = JSON.parse(storedCityJSON);
            spoofedTimezone = selectedCityData.timezone;
        } catch (e) {
            selectedCityData = null;
        }
    }

    if (!selectedCityData) {
        const timezones = Object.keys(cityDataByTimezone);
        spoofedTimezone = timezones[Math.floor(Math.random() * timezones.length)];
        const citiesInTimezone = cityDataByTimezone[spoofedTimezone];
        selectedCityData = citiesInTimezone[Math.floor(Math.random() * citiesInTimezone.length)];
    }

    if (storedFingerprint) {
        try {
            fingerprintData = JSON.parse(storedFingerprint);
        } catch (e) {
            fingerprintData = null;
        }
    }

    if (!fingerprintData) {
        fingerprintData = {
            accuracyVariation: Math.floor(50 * Math.random()) + 20,
            deviceMemory: [4, 8, 16, 32][Math.floor(4 * Math.random())],
            webglVendor: ["Intel Inc.", "NVIDIA Corporation", "AMD", "Apple Inc."][Math.floor(4 * Math.random())],
            webglRenderer: ["Intel Iris OpenGL Engine", "NVIDIA GeForce GTX 1060", "AMD Radeon Pro 560", "Apple M1", "Intel HD Graphics 620"][Math.floor(5 * Math.random())],
            webrtcIPRange: ["8.8.8.", "8.8.4.", "1.1.1.", "1.0.0.", "208.67.222.", "208.67.220."][Math.floor(6 * Math.random())],
            webrtcLastOctet: Math.floor(254 * Math.random()) + 1
        };
        localStorage.setItem(FINGERPRINT_STORAGE_KEY, JSON.stringify(fingerprintData));
    }
    
    let originalRTCPeerConnection = null;
    let isPluginEnabled = true;

    // MODIFIED: 移除对 user-info-content.js 的依赖
    // window.addEventListener("message", ...)

    const spoofedOffsetMinutes = (function(timezone) {
        try {
            const now = new Date();
            const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
            const formatter = new Intl.DateTimeFormat("en", { timeZone: timezone, timeZoneName: "longOffset" });
            const tzNamePart = formatter.formatToParts(now).find(part => "timeZoneName" === part.type);
            if (tzNamePart && tzNamePart.value) {
                const match = tzNamePart.value.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
                if (match) {
                    const sign = match[1] === "+" ? 1 : -1;
                    const hours = parseInt(match[2]);
                    return sign * (60 * hours + parseInt(match[3] || "0"));
                }
            }
            const localTimeInTz = (new Date(now.toLocaleString("en-US", { timeZone: timezone }))).getTime();
            return Math.round((localTimeInTz - utcTime) / 60000);
        } catch (error) {
            const fallbackOffsets = {"America/New_York": -240, "America/Chicago": -300, "America/Denver": -360, "America/Los_Angeles": -420, "Asia/Tokyo": 540, "Asia/Taipei": 480, "Asia/Singapore": 480};
            return fallbackOffsets[timezone] || 0;
        }
    })(spoofedTimezone);

    const spoofedLat = parseFloat(selectedCityData.lat.toFixed(6));
    const spoofedLng = parseFloat(selectedCityData.lng.toFixed(6));

    const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
        const result = originalResolvedOptions.call(this);
        result.timeZone = spoofedTimezone;
        result.locale = selectedCityData.locale;
        return result;
    };
    
    Date.prototype.getTimezoneOffset = function () { return spoofedOffsetMinutes; };

    const OriginalDate = Date;
    const originalToString = Date.prototype.toString;
    const originalToLocaleString = Date.prototype.toLocaleString;
    
    Date.prototype.toString = function () {
        const timestamp = this.getTime();
        const adjustedDate = new OriginalDate(timestamp - 60 * spoofedOffsetMinutes * 1000);
        return originalToString.call(adjustedDate).replace(/GMT[+-]\d{4}.*$/, `(${spoofedTimezone.replace('_', ' ')} Time)`);
    };

    Date.prototype.toLocaleString = function (locales, options) {
        options = options || {};
        options.timeZone = spoofedTimezone;
        const finalLocales = locales || selectedCityData.locale;
        return originalToLocaleString.call(this, finalLocales, options);
    };

    window.Date = function (...args) {
        let instance = new OriginalDate(...args);
        Object.setPrototypeOf(instance, Date.prototype);
        return instance;
    };
    Object.setPrototypeOf(window.Date, OriginalDate);
    Object.assign(window.Date, OriginalDate);

    const OriginalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function (locales, options) {
        options = options || {};
        options.timeZone = spoofedTimezone;
        const finalLocales = locales || selectedCityData.locale;
        return new OriginalDateTimeFormat(finalLocales, options);
    };
    Intl.DateTimeFormat.prototype = OriginalDateTimeFormat.prototype;
    Object.assign(Intl.DateTimeFormat, OriginalDateTimeFormat);

    const fakeGeolocation = {
        getCurrentPosition: (success) => {
            if (success) {
                const position = {
                    coords: {
                        latitude: spoofedLat + (Math.random() - 0.5) * 0.001,
                        longitude: spoofedLng + (Math.random() - 0.5) * 0.001,
                        accuracy: fingerprintData.accuracyVariation,
                        altitude: null, altitudeAccuracy: null, heading: null, speed: null
                    },
                    timestamp: Date.now()
                };
                setTimeout(() => success(position), 100);
            }
        },
        watchPosition: (success) => {
            const watchId = setInterval(() => {
                if (success) {
                    const position = {
                        coords: {
                            latitude: spoofedLat + (Math.random() - 0.5) * 0.001,
                            longitude: spoofedLng + (Math.random() - 0.5) * 0.001,
                            accuracy: fingerprintData.accuracyVariation,
                            altitude: null, altitudeAccuracy: null, heading: null, speed: null
                        },
                        timestamp: Date.now()
                    };
                    success(position);
                }
            }, 1000);
            return watchId;
        },
        clearWatch: (watchId) => { clearInterval(watchId); }
    };
    Object.defineProperty(navigator, "geolocation", { get: () => fakeGeolocation, configurable: true });

    try {
        const locale = selectedCityData.locale;
        const language = locale.split("-")[0];
        const languages = [locale, language, 'en-US', 'en'];
        Object.defineProperty(navigator, "language", { get: () => locale, configurable: true });
        Object.defineProperty(navigator, "languages", { get: () => [...new Set(languages)], configurable: true });
    } catch (e) {}

    const fakeWebRTCIP = fingerprintData.webrtcIPRange + fingerprintData.webrtcLastOctet;

    function interceptRTCPeerConnection() {
        if (!window.RTCPeerConnection || !isPluginEnabled) return;
        if (!originalRTCPeerConnection) originalRTCPeerConnection = window.RTCPeerConnection;
        
        window.RTCPeerConnection = function (config) {
            const modifiedConfig = { ...config, iceServers: [], iceCandidatePoolSize: 0 };
            const pc = new originalRTCPeerConnection(modifiedConfig);
            const originalAddEventListener = pc.addEventListener;
            pc.addEventListener = function (type, listener, options) {
                if (type === "icecandidate") {
                    const wrappedListener = (event) => {
                        if (event.candidate) {
                            const fakeCandidate = new RTCIceCandidate({
                                candidate: `candidate:1 1 UDP 2130706431 ${fakeWebRTCIP} 54400 typ host`,
                                sdpMid: event.candidate.sdpMid,
                                sdpMLineIndex: event.candidate.sdpMLineIndex,
                            });
                            const modifiedEvent = new RTCIceCandidate(fakeCandidate);
                            Object.defineProperty(modifiedEvent, 'candidate', {value: fakeCandidate, writable: false});
                            listener.call(this, modifiedEvent);
                        } else {
                            listener.call(this, event);
                        }
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
            return pc;
        };
        window.RTCPeerConnection.prototype = originalRTCPeerConnection.prototype;
        if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = window.RTCPeerConnection;
        if (window.mozRTCPeerConnection) window.mozRTCPeerConnection = window.RTCPeerConnection;
    }
    interceptRTCPeerConnection();

    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function (obj, prop, descriptor) {
        if (obj === window && (prop === 'RTCPeerConnection' || prop === 'webkitRTCPeerConnection' || prop === 'mozRTCPeerConnection')) {
            const result = originalDefineProperty.call(this, obj, prop, descriptor);
            setTimeout(interceptRTCPeerConnection, 0);
            return result;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };

    try {
        if (typeof navigator.deviceMemory !== "undefined") {
            Object.defineProperty(navigator, "deviceMemory", { get: () => fingerprintData.deviceMemory, configurable: true });
        }
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function (pname) {
            if (pname === this.VENDOR) return fingerprintData.webglVendor;
            if (pname === this.RENDERER) return fingerprintData.webglRenderer;
            return originalGetParameter.call(this, pname);
        };
        if (window.WebGL2RenderingContext) {
            const originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
            WebGL2RenderingContext.prototype.getParameter = function (pname) {
                if (pname === this.VENDOR) return fingerprintData.webglVendor;
                if (pname === this.RENDERER) return fingerprintData.webglRenderer;
                return originalGetParameter2.call(this, pname);
            };
        }
    } catch (e) {}

})();