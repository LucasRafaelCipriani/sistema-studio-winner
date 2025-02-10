import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';

// Configuração necessária para lidar com __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Studio Winner',
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:5173');

  if (isDev) {
    const contextMenu = new Menu();
    contextMenu.append(new MenuItem({ label: 'Recarregar', role: 'reload' }));
    contextMenu.append(
      new MenuItem({
        label: 'DevTools',
        click: () => mainWindow.webContents.openDevTools(),
      })
    );

    mainWindow.webContents.on('context-menu', (event, params) => {
      contextMenu.popup(mainWindow, params.x, params.y);
    });
  }

  const menuTemplate = [
    {
      label: 'Início',
      click: () => {
        mainWindow.webContents.send('inicio');
      },
    },
    {
      label: 'Cadastro Clientes',
      click: () => {
        mainWindow.webContents.send('cadastro-clientes');
      },
    },
    {
      label: 'Consulta Clientes',
      click: () => {
        mainWindow.webContents.send('consulta-clientes');
      },
    },
    {
      label: 'Gráficos',
      click: () => {
        mainWindow.webContents.send('graficos');
      },
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  ipcMain.on('send-user-data', (event, data) => {
    console.log('User saved: ', data);

    event.reply('get-users', [data]);
  });
});
