// src/services/backgroundSyncService.js

class BackgroundSyncService {
    constructor() {
      this.db = null;
      this.storeName = 'pendingNotifications';
    }
  
    async init() {
      if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
        console.warn('Background sync not supported');
        return false;
      }
  
      try {
        await this.openDB();
        return true;
      } catch (error) {
        console.error('Background sync init error:', error);
        return false;
      }
    }
  
    async openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('IpoPageDB', 1);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          }
        };
      });
    }
  
    async queueNotification(notification) {
      try {
        await this.saveNotification(notification);
        await this.registerSync();
        return true;
      } catch (error) {
        console.error('Queue notification error:', error);
        return false;
      }
    }
  
    async saveNotification(notification) {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add({
          ...notification,
          timestamp: Date.now(),
          status: 'pending'
        });
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async registerSync() {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('ipo-notification-sync');
        return true;
      } catch (error) {
        console.error('Register sync error:', error);
        return false;
      }
    }
  
    async getPendingNotifications() {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const backgroundSyncService = new BackgroundSyncService();