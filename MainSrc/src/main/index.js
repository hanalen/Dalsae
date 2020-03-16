// #region 프로그램 구동에 필요한 코드 및 로그
const {app, BrowserWindow, Menu, MenuItem, protocol, ipcMain, ipcRenderer} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
const windowStateKeeper = require('electron-window-state');//윈도우 창 크기,위치 저장하는 애

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function sendStatusToWindow(text) {
  log.info(text);
}

const winURL = process.env.NODE_ENV === 'development'//시작 url
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// #endregion


//#region path설정
const configPath=app.getPath('userData')+'/Dalsae/config.json';//폴더 경로 저장하는 파일
var config=undefined;
function CreateConfig(){
  const fs = require('fs-extra');//경로 설정 파일 찾기
  if(fs.existsSync(configPath)){
    config = fs.readJsonSync(configPath, { throws: false });
  }
  ipcMain.on('GetConfigPath', ()=>{//FileAgent에서 설정을 요청하면 설정 send
    sendStatusToWindow('called configPath')
    sendStatusToWindow(config)
    mainWindow.webContents.send('ConfigPath', config);
  });
}
function ConfigChange(path){//설정 바뀌면 FileAgent에 쏴줘야함
  if(path==undefined) return;
  if(path.length==0) return;
  const fs = require('fs-extra');//경로 설정 파일 찾기
  config=new Object();
  config.path=path[0];
  sendStatusToWindow('config change')
  sendStatusToWindow(config)
  sendStatusToWindow(path[0])
  mainWindow.webContents.send('ConfigChange', config);
  fs.writeJson(configPath, config, 'utf-8')
  .then(() => {
  })
}

//#endregion

// #region 메인윈도우
let mainWindow

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
    webPreferences: {webSecurity: false}
  })
  CreateConfig();
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

//#endregion

//#region 이미지 윈도우
const template = [
  {
     label: '파일',
     submenu: [
      {
        label: '설정 저장 폴더 열기',
        click: function() {
          const {shell} = require('electron') // deconstructing assignment
          shell.openItem(app.getPath('userData')+'/Dalsae')
        },
        // accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'//단축키
      },
      {
        label: '이미지 폴더 열기',
        click: function() {
          const {shell} = require('electron') // deconstructing assignment
          shell.openItem(app.getPath('userData')+'/Dalsae/Image')
        },
        // accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'//단축키
      },
      {
        label: '설정 저장 폴더 위치 변경',
        click: function() {
          const { dialog } = require('electron')
          var dir = dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        ConfigChange(dir);
      },
        // accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'//단축키
      },
    ]
  }
]


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


var imageWin=[];
let imageWindowState=undefined;
function CreateImageWindow(){
const windowStateKeeper2 = require('electron-window-state');//윈도우 창 크기,위치 저장하는 애
  
  imageWindowState = windowStateKeeper2({
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
    

    const modalPath = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/Image'
        : `file://${__dirname}/index.html#Image`
    win.loadURL(modalPath);

    imageWin.push(win);
    ImageWindowSetEvent(win);
  }
}


function ImageWindowSetEvent(win){
  win.on('close', (e)=>{
    if(mainWindow!=null){
      e.preventDefault();
      win.webContents.send('hide');
      win.hide();
      mainWindow.focus();
    }
    else{
      imageWindowState.saveState(win);
    }
  });
  win.on('show', (e)=>{
    win.webContents.send('Focus');
  });
  const electronLocalshortcut = require('electron-localshortcut');
  electronLocalshortcut.register(win, 'ESC', () => {
    win.close();
  });
  electronLocalshortcut.register(win, 'ENTER', () => {
    win.close();
  });
  electronLocalshortcut.register(win, 'Ctrl+S', ()=>{
    win.webContents.send('Save')
  })
  electronLocalshortcut.register(win, 'Ctrl+A', ()=>{
    win.webContents.send('SaveAll')
  })
}
var imageIndex=0;

ipcMain.on('child', (event, tweet, option)=>{
  imageWindowState.manage(imageWin[imageIndex]);
  imageWin[imageIndex].webContents.send('tweet', tweet, option)

  imageWin[imageIndex].show();
  imageIndex++;
  if(imageIndex > 3)
    imageIndex=0;
})

//#endregion

//#region 뮤트 윈도우
var muteOptionWin=null;

ipcMain.on('OpenMuteOptionPopup', (event, option)=>{
  if(muteOptionWin) return;//2번 생성 막기
  muteOptionWin = new BrowserWindow({show:false,width:540, height:400, devTools :false});
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

//#endregion

//#region 자동업데이트

ipcMain.on('restart_app', ()=>{
  autoUpdater.quitAndInstall(true, true);
});

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

//#endregion

//#region 프로그램 시작 및 종료
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
//#endregion

//#region 윈도우 이벤트
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
//#endregion