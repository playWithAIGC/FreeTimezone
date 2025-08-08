/**
 * user-data-manager.js
 * 
 * MODIFIED: 为了避免与实际系统的交互，所有函数都被修改为直接返回伪造的数据或状态。
 *           例如，get() 函数总是返回一个伪造的用户对象，isLoggedIn() 函数总是返回 true，
 *           isExpired() 函数总是返回 false，以此类推。这样就可以在不需要真实的用户数据的情况下测试系统的行为。
 */

class UserDataManager {
    constructor() {
        this.STORAGE_KEY = "plugin_user_data";
        this.API_BASE = "http://192.168.75.168/api";
    }

    /**
     * MODIFIED: 总是返回一个伪造的、永不过期的用户对象。
     */
    async get() {
        const fakeUser = {
            user_id: "free_user_001",
            username: "Free User",
            remaining_days: 9999,
            status: "active",
            expires_at: new Date('2099-12-31T23:59:59Z').toISOString(),
            login_time: Date.now(),
            last_validated: Date.now()
        };
        return fakeUser;
    }

    /**
     * MODIFIED: 总是返回 true，让系统认为已登录。
     */
    async isLoggedIn() {
        console.log("MODIFIED: isLoggedIn() -> always true");
        return true;
    }

    /**
     * MODIFIED: 总是返回 false，让系统认为永不过期。
     */
    async isExpired() {
        console.log("MODIFIED: isExpired() -> always false");
        return false;
    }

    /**
     * MODIFIED: 总是返回伪造的用户数据，避免网络请求。
     */
    async validateWithServer() {
        console.log("MODIFIED: validateWithServer() -> returning fake user data");
        return await this.get();
    }
    
    /**
     * MODIFIED: 登录函数直接返回成功。
     */
    async login(username, password) {
        console.log("MODIFIED: login() -> bypassed");
        return { success: true, userData: await this.get(), message: "登录成功 (Bypassed)" };
    }

    /**
     * MODIFIED: 注册函数直接返回失败。
     */
    async register(username, password, activationCode) {
        console.log("MODIFIED: register() -> disabled");
        return { success: false, message: "注册功能已禁用" };
    }
    
    /**
     * MODIFIED: 激活函数直接返回失败。
     */
    async activate(activationCode) {
        console.log("MODIFIED: activate() -> disabled");
        return { success: false, message: "激活功能已禁用" };
    }
    
    /**
     * MODIFIED: 在免登录模式下，set 操作被禁用。
     */
    async set(userData) {
        console.log("MODIFIED: set() -> disabled");
        return true;
    }

    /**
     * MODIFIED: 在免登录模式下，clear 操作被禁用。
     */
    async clear() {
        console.log("MODIFIED: clear() -> disabled");
        return true;
    }
    
    /**
     * MODIFIED: 登出功能被禁用。
     */
    async logout() {
        console.log("MODIFIED: logout() -> disabled");
        return true;
    }

    /**
     * MODIFIED: 总是返回一个永不过期的状态。
     */
    calculateRealTimeExpiration(userData) {
        return {
            remainingDays: 9999,
            isExpired: false,
            expireDate: "Never",
            calculationMethod: "bypassed_free_mode",
            timeInfo: { isExpired: false, remainingDays: 9999 }
        };
    }

    /**
     * MODIFIED: 总是返回一个已登录且有效的状态。
     */
    async getStatus() {
        const fakeStatus = {
            loggedIn: true,
            expired: false,
            remainingDays: 9999,
            status: "active",
            username: "Free User",
            userId: "free_user_001",
            expireDate: "Never",
        };
        return fakeStatus;
    }

    // --- 其他不再重要的方法，保留空实现 ---
    async migrateOldData() { return null; }
    async checkDuplicateRegistration() { return false; }
    async createRegistrationMark(username) {}
    generateBrowserId() { return "fake_browser_id"; }
}

// 实例化并暴露给全局作用域
const userDataManager = new UserDataManager();
if (typeof window !== "undefined") {
    window.userDataManager = userDataManager;
}