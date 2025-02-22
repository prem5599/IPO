// src/services/pushNotificationService.js

class PushNotificationService {
    constructor() {
      this.swRegistration = null;
      this.isSubscribed = false;
    }
  
    async init() {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          throw new Error('Push notifications are not supported');
        }
  
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
  
        this.isSubscribed = await this.checkSubscription();
        return true;
      } catch (error) {
        console.error('Push notification init error:', error);
        return false;
      }
    }
  
    async checkSubscription() {
      try {
        const subscription = await this.swRegistration?.pushManager.getSubscription();
        return !!subscription;
      } catch (error) {
        console.error('Subscription check error:', error);
        return false;
      }
    }
  
    async subscribe(ipoSymbol) {
      try {
        const subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        });
  
        // Save subscription to your backend
        await this.saveSubscription(subscription, ipoSymbol);
        
        this.isSubscribed = true;
        return subscription;
      } catch (error) {
        console.error('Subscription error:', error);
        throw error;
      }
    }
  
    async unsubscribe(ipoSymbol) {
      try {
        const subscription = await this.swRegistration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          // Remove subscription from your backend
          await this.removeSubscription(subscription, ipoSymbol);
        }
        this.isSubscribed = false;
        return true;
      } catch (error) {
        console.error('Unsubscribe error:', error);
        throw error;
      }
    }
  
    async saveSubscription(subscription, ipoSymbol) {
      try {
        const response = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription,
            ipoSymbol,
            timestamp: Date.now()
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save subscription');
        }
      } catch (error) {
        console.error('Save subscription error:', error);
        throw error;
      }
    }
  
    async removeSubscription(subscription, ipoSymbol) {
      try {
        const response = await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription,
            ipoSymbol
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to remove subscription');
        }
      } catch (error) {
        console.error('Remove subscription error:', error);
        throw error;
      }
    }
  
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
  
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
  
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    
// Add to existing service...

async subscribe(ipoSymbol) {
    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
      });
  
      // Queue the subscription for background sync
      await backgroundSyncService.queueNotification({
        type: 'subscribe',
        subscription,
        ipoSymbol,
        timestamp: Date.now()
      });
  
      this.isSubscribed = true;
      return subscription;
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }
  }
  
  export const pushNotificationService = new PushNotificationService();
  