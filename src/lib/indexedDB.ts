import { openDB, DBSchema } from "idb";

const DB_NAME = "imageCache";
const STORE_NAME = "images";

interface ImageCacheDB extends DBSchema {
  images: {
    key: string;
    value: {
      blob: Blob;
      timestamp: number;
    };
  };
}

const dbPromise = openDB<ImageCacheDB>(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export const setItem = async (
  key: string,
  value: { blob: Blob; timestamp: number }
): Promise<void> => {
  const db = await dbPromise;
  await db.put(STORE_NAME, value, key);
};

export const getItem = async (
  key: string
): Promise<{ blob: Blob; timestamp: number } | undefined> => {
  const db = await dbPromise;
  return db.get(STORE_NAME, key);
};

export const clearOldItems = async (maxAge: number): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  let cursor = await store.openCursor();
  const now = Date.now();

  while (cursor) {
    if (now - cursor.value.timestamp > maxAge) {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }

  await tx.done;
};
