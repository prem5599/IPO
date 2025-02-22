// src/services/offlineManager.js

class OfflineManager {
    constructor() {
        this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
        this.listeners = new Set();
    }

    init() {
        if (typeof window === 'undefined') return;

        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }

    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        this.notifyListeners();
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.isOnline);
            } catch (error) {
                console.error('Error in offline manager listener:', error);
            }
        });
    }

    getOfflineData() {
        try {
            const data = localStorage.getItem('offline_ipo_data');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting offline data:', error);
            return null;
        }
    }

    saveOfflineData(data) {
        try {
            localStorage.setItem('offline_ipo_data', JSON.stringify({
                data,
                timestamp: Date.now()
            }));
            return true;
        } catch (error) {
            console.error('Error saving offline data:', error);
            return false;
        }
    }

    clearOfflineData() {
        try {
            localStorage.removeItem('offline_ipo_data');
            return true;
        } catch (error) {
            console.error('Error clearing offline data:', error);
            return false;
        }
    }
}

export const offlineManager = new OfflineManager();

// Initialize if in browser environment
if (typeof window !== 'undefined') {
    offlineManager.init();
}