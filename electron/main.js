/* eslint-disable no-undef */
import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron';
import { writeFileSync, readFileSync, existsSync } from 'fs';
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
    icon: path.join(
      __dirname,
      'assets',
      process?.platform === 'win32'
        ? 'logo-win.ico'
        : process?.platform === 'linux'
        ? 'logo-linux.png'
        : 'logo-mac.png'
    ),
    resizable: true,
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
      label: 'Tabela Clientes',
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

  ipcMain.handle('get-users-data', async () => {
    let fileData = [];

    if (existsSync('data.json')) {
      fileData = JSON.parse(readFileSync('data.json'));
    }

    return fileData;
  });

  ipcMain.handle('show-delete-confirmation', async () => {
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'Confirmação',
      message: 'Tem certeza que deseja deletar este item?',
      buttons: ['Cancelar', 'Deletar'],
      defaultId: 0,
      cancelId: 0,
    });

    return result.response === 1;
  });

  ipcMain.on('send-user-data', (event, data) => {
    let fileData = [];

    try {
      if (existsSync('data.json')) {
        fileData = JSON.parse(readFileSync('data.json'));
      }

      fileData.unshift(data);

      writeFileSync('data.json', JSON.stringify(fileData, null, 2));

      event.reply('user-response', true);
    } catch (error) {
      console.error(error);
      event.reply('user-response', false);
    }
  });

  ipcMain.on('delete-user-data', (event, data) => {
    let fileData = [];

    try {
      if (existsSync('data.json')) {
        fileData = JSON.parse(readFileSync('data.json'));
      }

      const newFileData = fileData.filter((user) => user.id !== data.id);

      writeFileSync('data.json', JSON.stringify(newFileData, null, 2));

      event.reply('user-response', true, true);
    } catch (error) {
      console.error(error);
      event.reply('user-response', false);
    }
  });
});
