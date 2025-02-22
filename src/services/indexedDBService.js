// src/services/indexedDBService.js

class IndexedDBService {
    constructor() {
        this.dbName = 'IPOPageDB';
        this.version = 1;
        this.stores = {
            ipos: 'ipos',
            subscriptions: 'subscriptions',
            userPreferences: 'userPreferences'
        };
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create IPOs store
                if (!db.objectStoreNames.contains(this.stores.ipos)) {
                    const ipoStore = db.createObjectStore(this.stores.ipos, { keyPath: 'symbol' });
                    ipoStore.createIndex('status', 'status');
                    ipoStore.createIndex('name', 'name');
                }

                // Create subscriptions store
                if (!db.objectStoreNames.contains(this.stores.subscriptions)) {
                    const subscriptionStore = db.createObjectStore(this.stores.subscriptions, { keyPath: 'ipoSymbol' });
                    subscriptionStore.createIndex('timestamp', 'timestamp');
                }

                // Create preferences store
                if (!db.objectStoreNames.contains(this.stores.userPreferences)) {
                    db.createObjectStore(this.stores.userPreferences, { keyPath: 'id' });
                }
            };
        });
    }

    async saveIPOs(ipos, category) {
        const db = await this.initDB();
        const transaction = db.transaction(this.stores.ipos, 'readwrite');
        const store = transaction.objectStore(this.stores.ipos);

        return Promise.all(ipos.map(ipo => {
            return new Promise((resolve, reject) => {
                const request = store.put({
                    ...ipo,
                    status: category,
                    lastUpdated: Date.now()
                });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }));
    }

    async getIPOs(category) {
        const db = await this.initDB();
        const transaction = db.transaction(this.stores.ipos, 'readonly');
        const store = transaction.objectStore(this.stores.ipos);
        const index = store.index('status');

        return new Promise((resolve, reject) => {
            const request = index.getAll(category);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveSubscription(subscription) {
        const db = await this.initDB();
        const transaction = db.transaction(this.stores.subscriptions, 'readwrite');
        const store = transaction.objectStore(this.stores.subscriptions);

        return new Promise((resolve, reject) => {
            const request = store.put({
                ...subscription,
                timestamp: Date.now()
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSubscriptions() {
        const db = await this.initDB();
        const transaction = db.transaction(this.stores.subscriptions, 'readonly');
        const store = transaction.objectStore(this.stores.subscriptions);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteSubscription(ipoSymbol) {
        const db = await this.initDB();
        const transaction = db.transaction(this.stores.subscriptions, 'readwrite');
        const store = transaction.objectStore(this.stores.subscriptions);

        return new Promise((resolve, reject) => {
            const request = store.delete(ipoSymbol);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async savePreference(preference) {
        const db = await this.initDB();
        const transaction = db.transaction(this.stores.userPreferences, 'readwrite');
        const store = transaction.objectStore(this.stores.userPreferences);

        return new Promise((resolve, reject) => {
            const request = store.put(preference);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearDatabase() {
        const db = await this.initDB();
        const storeNames = Object.values(this.stores);
        const transaction = db.transaction(storeNames, 'readwrite');

        await Promise.all(storeNames.map(storeName => {
            return new Promise((resolve, reject) => {
                const request = transaction.objectStore(storeName).clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }));
    }
}

export const indexedDBService = new IndexedDBService();