import { useState, useEffect, useCallback, useRef } from 'react';

const isBrowser = typeof window !== 'undefined';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (!isBrowser) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, value]);

  // Keeps state in sync if the same key changes in another tab/window.
  useEffect(() => {
    if (!isBrowser) return;
    const onStorage = (e) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      } catch (error) {
        console.error('Error parsing storage event value:', error);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue]);

  return [value, setValue];
};

const DB_NAME = 'ARDrawDB';
const DB_VERSION = 1;

export const useIndexedDB = () => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const dbRef = useRef(null);

  useEffect(() => {
    if (!isBrowser || !window.indexedDB) {
      setError('IndexedDB is not available in this environment');
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      setError(request.error?.message || 'Failed to open database');
    };

    request.onsuccess = () => {
      dbRef.current = request.result;
      setDb(request.result);
    };

    request.onblocked = () => {
      setError('Database upgrade blocked - close other tabs running this app and reload');
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains('images')) {
        const imageStore = database.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
        imageStore.createIndex('name', 'name', { unique: false });
        imageStore.createIndex('category', 'category', { unique: false });
        imageStore.createIndex('favorite', 'favorite', { unique: false });
        imageStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains('sessions')) {
        database.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
      }
    };

    return () => {
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, []);

  const saveImage = useCallback(async (imageData) => {
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.add({ ...imageData, timestamp: Date.now() });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const getImage = useCallback(async (id) => {
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const getAllImages = useCallback(async () => {
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Uses the 'category' index (already created, previously unused) instead
  // of loading every image and filtering in JS - matters once the gallery
  // (Botanical / Architecture / Portraits) has many saved images.
  const getImagesByCategory = useCallback(async (category) => {
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readonly');
      const index = transaction.objectStore('images').index('category');
      const request = index.getAll(category);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Uses the 'favorite' index. Note: `favorite` must be stored as boolean
  // `true`/`false` for this key range to match.
  const getFavoriteImages = useCallback(async () => {
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readonly');
      const index = transaction.objectStore('images').index('favorite');
      const request = index.getAll(IDBKeyRange.only(true));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const deleteImage = useCallback(async (id) => {
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const updateImage = useCallback(async (id, updates) => {
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        // Previously, a missing record silently fell through to
        // store.put({ ...undefined, ...updates }), which could write a
        // malformed/partial record instead of failing loudly.
        if (!data) {
          reject(new Error(`No image found with id ${id}`));
          return;
        }
        const updateRequest = store.put({ ...data, ...updates });
        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }, [db]);

  const saveSession = useCallback(async (sessionData) => {
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.add({ ...sessionData, timestamp: Date.now() });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  return {
    db,
    error,
    saveImage,
    getImage,
    getAllImages,
    getImagesByCategory,
    getFavoriteImages,
    deleteImage,
    updateImage,
    saveSession
  };
};