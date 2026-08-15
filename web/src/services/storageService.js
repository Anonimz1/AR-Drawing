export class StorageService {
  static DB_NAME = 'ARDrawDB';
  static DB_VERSION = 1;
  static STORES = {
    IMAGES: 'images',
    SESSIONS: 'sessions',
    SETTINGS: 'settings'
  };

  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Images store
        if (!db.objectStoreNames.contains(this.STORES.IMAGES)) {
          const imageStore = db.createObjectStore(this.STORES.IMAGES, {
            keyPath: 'id',
            autoIncrement: true
          });
          imageStore.createIndex('name', 'name', { unique: false });
          imageStore.createIndex('category', 'category', { unique: false });
          imageStore.createIndex('favorite', 'favorite', { unique: false });
          imageStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Sessions store
        if (!db.objectStoreNames.contains(this.STORES.SESSIONS)) {
          const sessionStore = db.createObjectStore(this.STORES.SESSIONS, {
            keyPath: 'id',
            autoIncrement: true
          });
          sessionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains(this.STORES.SETTINGS)) {
          db.createObjectStore(this.STORES.SETTINGS, { keyPath: 'key' });
        }
      };
    });
  }

  static async saveImage(imageData) {
    const db = await this.openDB();
    const transaction = db.transaction([this.STORES.IMAGES], 'readwrite');
    const store = transaction.objectStore(this.STORES.IMAGES);

    return new Promise((resolve, reject) => {
      const request = store.add({
        ...imageData,
        timestamp: Date.now()
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async getImage(id) {
    const db = await this.openDB();
    const transaction = db.transaction([this.STORES.IMAGES], 'readonly');
    const store = transaction.objectStore(this.STORES.IMAGES);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async getAllImages() {
    const db = await this.openDB();
    const transaction = db.transaction([this.STORES.IMAGES], 'readonly');
    const store = transaction.objectStore(this.STORES.IMAGES);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async deleteImage(id) {
    const db = await this.openDB();
    const transaction = db.transaction([this.STORES.IMAGES], 'readwrite');
    const store = transaction.objectStore(this.STORES.IMAGES);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  static async updateImage(id, updates) {
    const db = await this.openDB();
    const transaction = db.transaction([this.STORES.IMAGES], 'readwrite');
    const store = transaction.objectStore(this.STORES.IMAGES);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (!data) {
          reject(new Error('Image not found'));
          return;
        }

        const updateRequest = store.put({ ...data, ...updates });
        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => reject(updateRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  static async saveSetting(key, value) {
    const db = await this.openDB();
    const transaction = db.transaction([this.STORES.SETTINGS], 'readwrite');
    const store = transaction.objectStore(this.STORES.SETTINGS);

    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  static async getSetting(key, defaultValue = null) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORES.SETTINGS], 'readonly');
      const store = transaction.objectStore(this.STORES.SETTINGS);

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : defaultValue);
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      return defaultValue;
    }
  }

  static isSupported() {
    return 'indexedDB' in window;
  }

  static async clearAll() {
    const db = await this.openDB();
    const stores = [this.STORES.IMAGES, this.STORES.SESSIONS, this.STORES.SETTINGS];

    for (const storeName of stores) {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    return true;
  }
}
