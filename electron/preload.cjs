const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Pages
  onInicio: (callback) =>
    ipcRenderer.on('inicio', (_event, ...args) => callback(...args)),
  onCadastroClientes: (callback) =>
    ipcRenderer.on('cadastro-clientes', (_event, ...args) => callback(...args)),
  onConsultaClientes: (callback) =>
    ipcRenderer.on('consulta-clientes', (_event, ...args) => callback(...args)),
  onGraficos: (callback) =>
    ipcRenderer.on('graficos', (_event, ...args) => callback(...args)),
  // Data
  onUserResponse: (callback) =>
    ipcRenderer.on('user-response', (_event, ...args) => callback(...args)),
  confirmDeletion: () => ipcRenderer.invoke('show-delete-confirmation'),
  getUsersData: (data) => ipcRenderer.invoke('get-users-data', data),
  sendUserData: (data) => ipcRenderer.send('send-user-data', data),
  deleteUserData: (data) => ipcRenderer.send('delete-user-data', data),
});
