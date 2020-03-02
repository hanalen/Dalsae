const {app, BrowserWindow, Menu, protocol, ipcMain, ipcRenderer} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
function sendStatusToWindow(text) {
  log.info(text);
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const windowStateKeeper = require('electron-window-state');//윈도우 창 크기,위치 저장하는 애
function createWindow () {
  /**
   * Initial window options
   */
  let mainWindowState = windowStateKeeper({
    defaultWidth: 600,
    defaultHeight: 800
  });
  sendStatusToWindow(mainWindowState)
  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    file:'mainWindow.json',
    minWidth:440,
    useContentSize: true,
    webPreferences: {webSecurity: false}
  })
  mainWindowState.manage(mainWindow);
  if(process.env.NODE_ENV === 'development'){
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadURL(winURL)
  mainWindow.on('focus', (e)=>{
    mainWindow.webContents.send('WindowFocused', e)
  });
  mainWindow.on('closed', () => {
    mainWindowState.saveState(mainWindow)
    mainWindow = null
    imageWin.forEach((win)=>{
      win.close();
    })
    imageWin=null;
    app.quit()
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}


ipcMain.on('restart_app', ()=>{
  autoUpdater.quitAndInstall(true, true);
});

var imageWin=[];
let imageWindowState=undefined;
function CreateImageWindow(){
  
  imageWindowState = windowStateKeeper({
    defaultWidth: 600,
    defaultHeight: 800,
    file:'imageWindow.json'
  });
  for(var i=0;i<4;i++){
    var win = new BrowserWindow({
      show:false,
      'x': imageWindowState.x,
      'y': imageWindowState.y,
      'width': imageWindowState.width,
      'height': imageWindowState.height,
    });
    imageWindowState.manage(win);

    const modalPath = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/Image'
        : `file://${__dirname}/index.html#Image`
    win.loadURL(modalPath);

    imageWin.push(win);
    ImageWindowHide(win);
  }
}

var muteOptionWin=null;

ipcMain.on('OpenMuteOptionPopup', (event, option)=>{
  if(muteOptionWin) return;//2번 생성 막기
  muteOptionWin = new BrowserWindow({show:false,width:1500, height:800, x:2000, y:0, devTools :false});
  const path = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/MuteOption'
        : `file://${__dirname}/index.html#MuteOption`
  muteOptionWin.loadURL(path);
  muteOptionWin.on('ready-to-show', ()=>{
    muteOptionWin.webContents.send('mute_option', option)
    muteOptionWin.show();
  })
  muteOptionWin.on('closed', (e)=>{
    muteOptionWin=null;
  });
})

ipcMain.on('MuteOptionSave', (event,muteOption)=>{
  sendStatusToWindow('muteOption Save')
  sendStatusToWindow(muteOption);
  mainWindow.webContents.send('MuteOptionSave', muteOption)
});

ipcMain.on('CloseMuteOptionPopup',()=>{
  muteOptionWin.close();
});



function ImageWindowHide(win){
  win.on('close', (e)=>{
    if(mainWindow!=null){
      e.preventDefault();
      win.hide();
    }
    else{
      imageWindowState.saveState(win);
    }
  });
}
var imageIndex=0;

ipcMain.on('child', (event, tweet, option)=>{
  imageWin[imageIndex].webContents.send('tweet', tweet, option)

  imageWin[imageIndex].show();
  imageIndex++;
  if(imageIndex > 3)
    imageIndex=0;
})



autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update_downloaded');
});

app.on('ready', ()=>{
    createWindow();
    CreateImageWindow();
    autoUpdater.checkForUpdates();
  }  
)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
