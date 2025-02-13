/* eslint-disable no-undef */
import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const mainUrl = isDev
  ? 'http://localhost:5173/'
  : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;

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
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL(`${mainUrl}#/`);

  const contextMenu = new Menu();
  contextMenu.append(new MenuItem({ label: 'Recarregar', role: 'reload' }));
  contextMenu.append(
    new MenuItem({
      label: 'DevTools',
      click: () => mainWindow.webContents.openDevTools(),
    })
  );

  mainWindow.webContents.on('context-menu', (_event, params) => {
    contextMenu.popup(mainWindow, params.x, params.y);
  });

  const menuTemplate = [
    {
      label: 'Início',
      click: () => {
        mainWindow.loadURL(`${mainUrl}#/`);
      },
    },
    {
      label: 'Cadastro Clientes',
      click: () => {
        mainWindow.loadURL(`${mainUrl}#/cadastro-clientes`);
      },
    },
    {
      label: 'Tabela Clientes',
      click: () => {
        mainWindow.loadURL(`${mainUrl}#/consulta-clientes`);
      },
    },
    {
      label: 'Gráficos',
      click: () => {
        mainWindow.loadURL(`${mainUrl}#/graficos`);
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

  ipcMain.handle('filter-users-data', async (_event, data) => {
    let fileData = [];

    if (existsSync('data.json')) {
      fileData = JSON.parse(readFileSync('data.json'));
    }

    const filteredFileData = fileData.filter(
      (item) =>
        (data.nome !== ''
          ? item.nome.toLowerCase().includes(data.nome.toLowerCase())
          : true) &&
        (data.telefone !== '' ? item.telefone.includes(data.telefone) : true) &&
        (data.mensalidade !== ''
          ? item.mensalidade === data.mensalidade
          : true) &&
        (data.metodo !== '' ? item.metodo === data.metodo : true)
    );

    return filteredFileData;
  });

  ipcMain.handle('show-delete-confirmation', async () => {
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'Confirmação',
      message: 'Tem certeza que deseja deletar este cliente?',
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

  ipcMain.on('edit-user-data', (event, data) => {
    let fileData = [];

    try {
      if (existsSync('data.json')) {
        fileData = JSON.parse(readFileSync('data.json'));
      }

      const index = fileData.findIndex((item) => item.id === data.id);

      fileData[index] = data;

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
