/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import insecam from 'insecam-api';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('get-countries', async (event) => {
  console.log('getting countries');
  const countries = await insecam.countries;
  event.reply('get-countries', countries);
});

ipcMain.on('get-places', async (event) => {
  console.log('getting places');
  const places = await insecam.places;
  event.reply('get-places', places);
});

ipcMain.on('get-manufacturers', async (event) => {
  console.log('getting manufacturers');
  const places = await insecam.manufacturers;
  event.reply('get-manufacturers', places);
});

ipcMain.on('get-manufacturer-cameras', async (event, manufacturer) => {
  console.log('getting cameras by manufacturer');
  const cameras = await insecam.manufacturer(manufacturer);
  let details = [];

  for (let id of cameras) {
    const d = await insecam.camera(id);
    details.push({
      details: d,
      id: id,
    });
  }
  event.reply('get-manufacturer-cameras', details);
});

ipcMain.on('get-camera-details', async (event, id) => {
  console.log('getting camera details');
  const details = await insecam.camera(id);
  event.reply('get-camera-details', { id, details });
});

ipcMain.on('get-place-cameras', async (event, place) => {
  console.log('getting cameras by place');
  const cameras = await insecam.place(place);
  let details = [];

  for (let id of cameras) {
    const d = await insecam.camera(id);
    details.push({
      details: d,
      id: id,
    });
  }
  event.reply('get-place-cameras', details);
});

ipcMain.on('get-country-cameras', async (event, country) => {
  console.log('getting cameras by country');
  const cameras = await insecam.country(country);
  let details = [];

  for (let id of cameras) {
    const d = await insecam.camera(id);
    details.push({
      details: d,
      id: id,
    });
  }
  event.reply('get-country-cameras', details);
});

ipcMain.on('get-new-cameras', async (event) => {
  console.log('getting new cameras');
  const cameras = await insecam.new;
  let details = [];

  for (let id of cameras) {
    const d = await insecam.camera(id);
    details.push({
      details: d,
      id: id,
    });
  }
  event.reply('get-new-cameras', details);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
