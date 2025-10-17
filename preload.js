const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    writeFile: async (filePath, data) => {
        try {
            await fs.writeFile(filePath, data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    getAppPath: () => {
        return path.join(require('electron').app.getPath('downloads'), 'RadheBilling');
    }
});