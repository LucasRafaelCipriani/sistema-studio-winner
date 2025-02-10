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
  onGetUsers: (callback) =>
    ipcRenderer.on('get-users', (_event, ...args) => callback(...args)),
  sendUserData: (data) => ipcRenderer.send('send-user-data', data),
});
