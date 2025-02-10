import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ping: () => console.log('Ping do Electron!'),
});
