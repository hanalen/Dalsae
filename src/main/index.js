const {app, BrowserWindow, Menu, protocol, ipcMain, ipcRenderer} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

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

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    minWidth:400,
    webPreferences: {webSecurity: false}
  })
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    imageWin=null
  })
}
ipcMain.on('restart_app', ()=>{
  autoUpdater.quitAndInstall(true, true);
});

var imageWin=[];

function CreateImageWindow(){
  for(var i=0;i<4;i++){
    sendStatusToWindow('win before')
    var win = new BrowserWindow({show:false});
    sendStatusToWindow('win one')

    const modalPath = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/Image'
        : `file://${__dirname}/index.html#Image`
    sendStatusToWindow('win two')
    win.loadURL(modalPath);
    sendStatusToWindow('win load')

    imageWin.push(win);
    ImageWindowHide(win);
  }
}

function ImageWindowHide(win){
  win.on('close', (e)=>{
    sendStatusToWindow('child close!')
    sendStatusToWindow(win)

    e.preventDefault();
    win.hide();
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
