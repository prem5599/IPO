// src/services/notificationService.js
class NotificationService {
    constructor() {
        this.hasSupport = typeof window !== 'undefined' && 'Notification' in window;
    }

    // Check and request notification permission
    async requestPermission() {
        if (!this.hasSupport) {
            console.warn('Notifications not supported');
            return false;
        }

        try {
            // If already granted, return true
            if (Notification.permission === 'granted') {
                return true;
            }

            // Request permission
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Check current permission status
    checkPermission() {
        if (!this.hasSupport) return false;
        return Notification.permission === 'granted';
    }

    // Show a generic notification
    async showNotification(title, options = {}) {
        if (!this.checkPermission()) {
            console.warn('Notification permission not granted');
            return false;
        }

        try {
            const notification = new Notification(title, {
                body: options.body || '',
                icon: options.icon || '/favicon.ico',
                tag: options.tag || 'ipo-notification',
                ...options
            });

            if (options.onClick) {
                notification.onclick = options.onClick;
            }

            return true;
        } catch (error) {
            console.error('Error showing notification:', error);
            return false;
        }
    }

    // Save user preferences for IPO notifications
    savePreferences(ipoSymbol, preferences) {
        try {
            localStorage.setItem(
                `ipo-notifications-${ipoSymbol}`,
                JSON.stringify({
                    ...preferences,
                    updatedAt: Date.now()
                })
            );
            return true;
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            return false;
        }
    }

    // Get user preferences for IPO notifications
    getPreferences(ipoSymbol) {
        try {
            const saved = localStorage.getItem(`ipo-notifications-${ipoSymbol}`);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error getting notification preferences:', error);
            return null;
        }
    }
}

export const notificationService = new NotificationService();