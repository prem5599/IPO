// public/sw.js
self.addEventListener('install', event => {
    console.log('Service Worker installed');
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activated');
  });
  
  self.addEventListener('push', event => {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: { url: data.url },
      actions: [
        {
          action: 'view',
          title: 'View IPO'
        }
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
      event.waitUntil(
        clients.openWindow(event.notification.data.url)
      );
    }
  });

  // public/sw.js

// Cache names
const CACHE_NAME = 'ipo-page-v1';
const DYNAMIC_CACHE = 'ipo-dynamic-v1';
const OFFLINE_URL = '/offline.html';

// Resources to cache
const STATIC_RESOURCES = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/images/logo.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
  );
});

// Background sync registration
self.addEventListener('sync', event => {
  if (event.tag === 'ipo-notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

// Function to sync pending notifications
async function syncNotifications() {
  try {
    const pendingNotifications = await getPendingNotifications();
    
    for (const notification of pendingNotifications) {
      try {
        const response = await fetch('/api/notifications/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });

        if (response.ok) {
          await removePendingNotification(notification.id);
        }
      } catch (error) {
        console.error('Sync failed for notification:', error);
      }
    }
  } catch (error) {
    console.error('Sync notifications error:', error);
  }
}

// IndexedDB setup for storing pending notifications
const dbName = 'IpoPageDB';
const storeName = 'pendingNotifications';

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Get pending notifications from IndexedDB
async function getPendingNotifications() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Remove synced notification from IndexedDB
async function removePendingNotification(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push event listener
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: { url: data.url },
    actions: [
      {
        action: 'view',
        title: 'View IPO'
      }
    ],
    timestamp: Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Offline fallback
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
  }
});