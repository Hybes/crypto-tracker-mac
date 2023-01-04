const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    saveConfig: (config) => ipcRenderer.invoke('config:save', config),
    loadConfig: () => ipcRenderer.invoke('config:load'),
    exit: () => ipcRenderer.invoke('config:exit')
})