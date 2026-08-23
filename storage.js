/**
 * MITTAL OS Virtual Storage Engine
 * Uses IndexedDB for production virtual filesystem and localStorage for system settings.
 */

class StorageEngine {
    constructor() {
        this.dbName = 'MittalOS_VFS';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('files')) {
                    const store = db.createObjectStore('files', { keyPath: 'path' });
                    store.createIndex('parent', 'parent', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this._seedInitialFS();
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('IndexedDB Failed:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async _seedInitialFS() {
        const root = await this.getFile('/');
        if (!root) {
            await this.writeFile('/', { type: 'directory', owner: 'system', parent: '' });
            await this.writeFile('/Documents', { type: 'directory', owner: 'shaurya', parent: '/' });
            await this.writeFile('/Pictures', { type: 'directory', owner: 'shaurya', parent: '/' });
            await this.writeFile('/Public', { type: 'directory', owner: 'public', parent: '/' });
            await this.writeFile('/Documents/welcome.txt', { 
                type: 'file', 
                content: 'Welcome to MITTAL OS — The Ultimate Web Operating Environment.', 
                owner: 'shaurya', 
                parent: '/Documents' 
            });
        }
    }

    async writeFile(path, fileData) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('files', 'readwrite');
            const store = tx.objectStore('files');
            const record = { path, updatedAt: Date.now(), ...fileData };
            const req = store.put(record);

            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async getFile(path) {
        return new Promise((resolve) => {
            const tx = this.db.transaction('files', 'readonly');
            const store = tx.objectStore('files');
            const req = store.get(path);

            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    }

    async readDirectory(parentPath) {
        return new Promise((resolve) => {
            const tx = this.db.transaction('files', 'readonly');
            const store = tx.objectStore('files');
            const index = store.index('parent');
            const req = index.getAll(parentPath);

            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
    }
}

export const VFS = new StorageEngine();
