'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog, screen } from 'electron';
import path from 'path';
import Log from 'electron-log';
import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin: BrowserWindow | null;
const listWindow: BrowserWindow[] = [];

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);
app.commandLine.appendSwitch('disable-web-security'); //cors회피 코드
app.whenReady().then(() => {
  //vue 개발자도구 열기
  installExtension(VUEJS_DEVTOOLS)
    .then((name: string) => console.log(`Added Extension:  ${name}`))
    .catch((err: Error) => console.log('An error occurred: ', err));
});

const pathAppConfig = app.getPath('userData') + '/Dalsae/AppConfig.json';
const baseUrl = process.env.WEBPACK_DEV_SERVER_URL
  ? (process.env.WEBPACK_DEV_SERVER_URL as string)
  : 'app://./index.html';

const isDevMode: boolean = process.env.WEBPACK_DEV_SERVER_URL ? true : false;
import electronLocalshortcut from 'electron-localshortcut';
import windowStateSaver from './WindowState';
function createWindow() {
  // Create the browser window.

  const windowState = windowStateSaver({
    defaultWidth: 600,
    defaultHeight: 1000,
    fileName: 'dalsae-main-window.json'
  });

  mainWin = new BrowserWindow({
    x: isDevMode ? 400 : windowState.x,
    y: isDevMode ? 0 : windowState.y,
    width: isDevMode ? 1900 : windowState.width,
    height: isDevMode ? 1100 : windowState.height,
    title: 'dalsae',
    autoHideMenuBar: true,
    webPreferences: {
      // Use pluginOptions.`nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      webSecurity: false,
      // enableRemoteModule: true,
      preload: path.join(__dirname, 'preload')
    }
  });
  if (isDevMode && windowState.manageWindow) {
    windowState.manageWindow(mainWin);
  }

  electronLocalshortcut.register(mainWin, 'F12', () => {
    mainWin?.webContents.openDevTools();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    // win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}Image`);
    mainWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);

    if (!process.env.IS_TEST) {
      mainWin.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    mainWin.loadURL(baseUrl);
  }
  if (isDevMode) mainWin.webContents.openDevTools();

  mainWin.on('closed', () => {
    mainWin = null;
    for (const win of listWindow) {
      win.destroy();
    }
  });
  mainWin.on('focus', () => {
    mainWin?.webContents.send('windowFocused');
  });
}

interface IpcParam {
  name: string;
  value?: any;
  data?: any;
}

const listIpcParam: IpcParam[] = [];

// ipcMain.on('AddChannel', (event, arg: IpcParam) => {
//   listIpcParam.push(arg);
//   ipcMain.once(arg.name, (event, arg2) => {
//     const ipc = listIpcParam.find(x => x.name === arg.name);
//     if (ipc) {
//       event.returnValue = ipc.value; //sync일 경우 이렇게 해야 함
//     }
//   });
// });

interface CreateWindowParam {
  url: string;
  title: string;
  type?: string;
  ipcName?: number;
}

ipcMain.on('AddChannelOn', (event, arg: IpcParam) => {
  mainWin?.webContents.send(arg.name, arg.data);
  for (const win of listWindow) {
    if (win) win.webContents.send(arg.name, arg.data);
  }
});

//메인윈도우에서 다른 윈도우 열기 전에 전달 할 데이터 등록
ipcMain.on('RegisterData', (event, arg: IpcParam) => {
  listIpcParam.push(arg);
});

//이미지, 비디오 등 윈도우에서 데이터 요청
ipcMain.on('GetData', (event, name: string) => {
  const idx = listIpcParam.findIndex(x => x.name === name);
  if (idx === -1) return;
  const find = listIpcParam[idx];
  listIpcParam.splice(idx, 1);
  mainWin?.webContents.send(name, find);
  for (const win of listWindow) {
    if (win) win.webContents.send(name, find.data);
  }
});

let imageWindow: BrowserWindow | undefined = undefined;
ipcMain.on('OpenWindow', (event, param: CreateWindowParam) => {
  if (param.type === 'image' && imageWindow) {
    //이미지 윈도우 요청일 경우 띄우고 종료
    imageWindow.webContents.send('showimage', { ipcName: param.ipcName });
    imageWindow.show();
    return;
  }
  const windowState = windowStateSaver({
    defaultWidth: 600,
    defaultHeight: 1000,
    fileName: `dalsae-${param.title}-window.json`
  });

  const window = new BrowserWindow({
    show: false,
    title: param.title,
    autoHideMenuBar: true,
    x: isDevMode ? 400 : windowState.x,
    y: isDevMode ? 0 : windowState.y,
    width: isDevMode ? 1900 : windowState.width,
    height: isDevMode ? 1200 : windowState.height,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload')
    }
  });
  if (param.type === 'image' && !imageWindow) {
    //이미지 윈도우 하나만 캐싱
    imageWindow = window;
  }
  if (isDevMode && windowState.manageWindow) {
    windowState.manageWindow(window);
  }
  window.loadURL(`${baseUrl}#${param.url}`);
  if (isDevMode) window.webContents.openDevTools();
  listWindow.push(window);

  window.on('ready-to-show', () => {
    if (param.type === 'image') window.webContents.send('showimage', { ipcName: param.ipcName });
    if (param.type === 'video') window.webContents.send('showvideo', { ipcName: param.ipcName });
    if (param.type === 'profile')
      window.webContents.send('showprofile', { ipcName: param.ipcName });
    window.show();
  });

  window.on('close', (e: Event) => {
    if (window === imageWindow) {
      e.preventDefault();
      imageWindow.hide();
    } else {
      const idx = listWindow.findIndex(x => x === window);
      listWindow.splice(idx, 1);
      window.destroy();
    }
    mainWin?.focus();
  });
  electronLocalshortcut.register(window, 'ESC', () => {
    window.close();
  });
  electronLocalshortcut.register(window, 'ENTER', () => {
    window.close();
  });
  electronLocalshortcut.register(window, 'F12', () => {
    window.webContents.openDevTools();
  });
});

import fs from 'fs-extra';
import { AppConfig } from '@/Interfaces';

ipcMain.on('GetAppPath', (event: Electron.IpcMainEvent) => {
  let path = app.getAppPath();
  if (fs.existsSync(pathAppConfig)) {
    const appConfig: AppConfig = fs.readJsonSync(pathAppConfig);
    if (appConfig) path = appConfig.appPath;
  } else {
    path = app.getPath('userData') + '/Dalsae/';
  }
  event.reply('GetAppPath', path);
});

ipcMain.on('MainWindowAlarm', () => {
  if (!mainWin) return;
  if (!mainWin.isFocused()) mainWin.flashFrame(true);
});

ipcMain.on('OpenPathSetting', async event => {
  if (!mainWin) return;
  const dir = await dialog.showOpenDialog(mainWin, {
    title: '달새 설정 폴더 위치 지정',
    properties: ['openDirectory']
  });
  if (dir.canceled) return;

  const appConfig: AppConfig = { appPath: dir.filePaths[0] };
  fs.writeJSON(pathAppConfig, appConfig);

  mainWin.webContents.send('pathSetting', { path: dir.filePaths[0] });
  event.reply('ChangeAppPath', dir.filePaths[0]);
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
  if (mainWin === null) {
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
