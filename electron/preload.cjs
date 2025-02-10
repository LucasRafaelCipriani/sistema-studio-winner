const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onInicio: (callback) =>
    ipcRenderer.on('inicio', (_event, ...args) => callback(...args)),
  onCadastroClientes: (callback) =>
    ipcRenderer.on('cadastro-clientes', (_event, ...args) => callback(...args)),
  onConsultaClientes: (callback) =>
    ipcRenderer.on('consulta-clientes', (_event, ...args) => callback(...args)),
  onGraficos: (callback) =>
    ipcRenderer.on('graficos', (_event, ...args) => callback(...args)),
});
