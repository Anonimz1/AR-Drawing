import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
};

export const useIndexedDB = () => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const openDB = () => {
      const request = indexedDB.open('ARDrawDB', 1);

      request.onerror = () => {
        setError('Failed to open database');
      };

      request.onsuccess = () => {
        setDb(request.result);
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
    };

    openDB();
  }, []);

  const saveImage = useCallback(async (imageData) => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.add({
        ...imageData,
        timestamp: Date.now()
      });

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
      const request = store.add({
        ...sessionData,
        timestamp: Date.now()
      });

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
    deleteImage,
    updateImage,
    saveSession
  };
};
