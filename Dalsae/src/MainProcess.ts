'use strict';

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Log from 'electron-log';
import { DataManager } from '@/views/Test/TestDataManager';
import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

const dataManagerImpl = DataManager;
app.whenReady().then(() => {
  //vue 개발자도구 열기
  installExtension(VUEJS_DEVTOOLS)
    .then((name: string) => console.log(`Added Extension:  ${name}`))
    .catch((err: Error) => console.log('An error occurred: ', err));
});
console.log('----------------');
console.log('----------------');
console.log('----------------');
console.log('----------------');
console.log(path.join(__dirname, 'preload'));
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'dalsae',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload')
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);

    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

interface IpcParam {
  name: string;
  value: string;
}

const listIpcParam: IpcParam[] = [];

ipcMain.on('AddChannel', (event, arg: IpcParam) => {
  Log.info('--------------');
  Log.info('Add Channel, preload에서 호출');
  // Log.info(event);
  Log.info(arg);
  Log.info(arg.name);
  Log.info(arg.value);

  listIpcParam.push(arg);
  ipcMain.once(arg.name, (event, arg2) => {
    //once는 한번 쏘고 삭제됨
    Log.info('--------------');
    Log.info('ipc dynamic on');
    Log.info(arg.name);
    Log.info(arg2);
    const ipc = listIpcParam.find(x => x.name === arg.name);
    Log.info(ipc);
    if (ipc) {
      event.returnValue = ipc.value; //sync일 경우 이렇게 해야 함
      // event.sender.send(name, ipc.value);
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
