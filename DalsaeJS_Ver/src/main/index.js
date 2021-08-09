// #region 프로그램 구동에 필요한 코드 및 로그
const {app, BrowserWindow, Menu, MenuItem, protocol, ipcMain, ipcRenderer, dialog} = require('electron');
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
    mainWindow.webContents.send('ConfigPath', config);
  });
}
function ConfigChange(path){//설정 바뀌면 FileAgent에 쏴줘야함
  if(path==undefined) return;
  if(path.length==0) return;
  const fs = require('fs-extra');//경로 설정 파일 찾기
  config=new Object();
  config.path=path[0];
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
    mainWindow.flashFrame(false)
  });
  mainWindow.on('blur', (e)=>{
    mainWindow.webContents.send('WindowFocusOut', e)
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
ipcMain.on('Alarm', (event)=>{
  if(!mainWindow.isFocused()){
    mainWindow.flashFrame(true);
  }
});

//#endregion

//#region 이미지 윈도우
const template = [
  {
     label: '파일',
     submenu: [
      {
        label: '설정 저장 폴더 열기',
        click: function() {
          const {shell} = require('electron')
          if(config){
            shell.openItem(config.path+'/Dalsae')
          }
          else{
            shell.openItem(app.getPath('userData')+'/Dalsae')
          }
        },
        // accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'//단축키
      },
      {
        label: '이미지 폴더 열기',
        click: function() {
          const {shell} = require('electron')
          if(config){
            shell.openItem(config.path+'/Dalsae/Image')
          }
          else{
            shell.openItem(app.getPath('userData')+'/Dalsae/Image')
          }
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
  },
  {
    label: '정보',
    submenu: [
     {
       label: '달새 정보 보기',
       click: function() {
        const appVersion = require('../../package.json').version;
        const options = {
          type: 'info',
          title: '정보',
          message: '달새 버전: '+appVersion+'\r\n'+'공식 계정: @Dalsae_info\r\n제작자: 하날엔(@hanalen_)',
        };
        dialog.showMessageBox(null, options)
       },
      },
      {
        label: '공식 계정으로 가기',
        click: function() {
          const { shell } = require('electron')
          shell.openExternal('https://twitter.com/Dalsae_info')
        },
      },
      {
        label: '공식 배포 페이지로 가기',
        click: function() {
          const { shell } = require('electron')
          shell.openExternal('https://github.com/hanalen-/Dalsae/releases')
        },
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
      mainWindow.webContents.send('ClosedImagePopup')
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

ipcMain.on('ShowImagePopup', (event, tweet, option)=>{
  imageWindowState.manage(imageWin[imageIndex]);
  imageWin[imageIndex].webContents.send('tweet', tweet, option, config)

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
  mainWindow.webContents.send('MuteOptionSave', muteOption)
});

ipcMain.on('CloseMuteOptionPopup',()=>{
  muteOptionWin.close();
});

//#endregion


//#region 뮤트 윈도우
var chaninBlockWindow=null;

ipcMain.on('OpenChainBlockPopup', (event, user, userInfo, listFollowing, listFollower, hashBlock)=>{
  if(chaninBlockWindow){//이미 떠있을 경우 새 유저 정보 불러오기
    chaninBlockWindow.webContents.send('ShowUser', user);
    return;
  } 
  if(userInfo==undefined || listFollower==undefined || listFollowing==undefined){
    mainWindow.webContents.send('GetChainBlockInfo', user);
  }
  else{
    CreateChainBlockWindow(userInfo, user, listFollowing, listFollower, hashBlock);
  }
})

ipcMain.on('GetChainBlockInfo', (event, userInfo, user, listFollowing, listFollower, hashBlock)=>{//메인윈도우에 체블 요청 받은 후
  CreateChainBlockWindow(userInfo, user, listFollowing, listFollower, hashBlock);
})

function CreateChainBlockWindow(user, userInfo, listFollowing, listFollower, hashBlock){
  chaninBlockWindow = new BrowserWindow({show:false,width:540, height:400, devTools :false, webPreferences: {webSecurity: false}});
  const path = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/ChainBlock'
        : `file://${__dirname}/index.html#ChainBlock`
        chaninBlockWindow.loadURL(path);
  chaninBlockWindow.on('ready-to-show', ()=>{
    chaninBlockWindow.webContents.send('ChainBlock', user, userInfo, listFollowing, listFollower, hashBlock);
    chaninBlockWindow.show();
  })
  chaninBlockWindow.on('closed', (e)=>{
    chaninBlockWindow=null;
  });
}

ipcMain.on('MuteOptionSave', (event,muteOption)=>{
  mainWindow.webContents.send('MuteOptionSave', muteOption)
});

ipcMain.on('CloseMuteOptionPopup',()=>{
  muteOptionWin.close();
});

//#endregion

//#region 단축키 팝업
var hotkeyWindow=null;

ipcMain.on('OpenHotkeyOptionPopup', (event, hotkey)=>{
  if(hotkeyWindow) return;//2번 생성 막기
  hotkeyWindow = new BrowserWindow({show:false,width:720, height:590, devTools :false});
  const path = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/HotkeyOption'
        : `file://${__dirname}/index.html#HotkeyOption`
        hotkeyWindow.loadURL(path);
  hotkeyWindow.on('ready-to-show', ()=>{
    hotkeyWindow.webContents.send('Hotkey', hotkey)
    hotkeyWindow.show();
  })
  hotkeyWindow.on('closed', (e)=>{
    hotkeyWindow=null;
  });
})

ipcMain.on('HotkeyOptionSave', (event, newHotkey)=>{
  mainWindow.webContents.send('SaveHotkey', newHotkey);
});

ipcMain.on('CloseHotkeyOptionPopup',()=>{
  hotkeyWindow.close();
});
//#endregion

//#region 프로필 팝업
var profileWindow=null;

ipcMain.on('ShowProfile', (event, screenName, userData, listFollower)=>{
  if(profileWindow) return;//2번 생성 막기
  profileWindow = new BrowserWindow({show:false,width:620, height:900, devTools :false, resizable:true,webPreferences: {webSecurity: false}});
  const path = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/Profile'
        : `file://${__dirname}/index.html#Profile`
        profileWindow.loadURL(path);
        profileWindow.on('ready-to-show', ()=>{
        profileWindow.webContents.send('Profile', screenName, userData, listFollower);
        profileWindow.show();
  })
  profileWindow.on('closed', (e)=>{
    profileWindow=null;
  });
})

ipcMain.on('LoadUserTweet',(event, screen_name)=>{
  sendStatusToWindow('LoadUserTweet');
  mainWindow.webContents.send('LoadUserTweet', screen_name)
});

ipcMain.on('CloseProfilePopup',()=>{
  profileWindow.close();
});
//#endregion

//#region 관글 윈도우
var favoriteWindow=null;

ipcMain.on('FavoritePopup', (event, tokenData)=>{
  if(favoriteWindow) return;//2번 생성 막기
  favoriteWindow = new BrowserWindow({show:false,width:1200, height:900, devTools :false, webPreferences: {webSecurity: false}});
  const path = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/Favorite'
        : `file://${__dirname}/index.html#Favorite`
  favoriteWindow.loadURL(path);
  favoriteWindow.on('ready-to-show', ()=>{
    favoriteWindow.webContents.send('UserData', tokenData, config)
    favoriteWindow.show();
  })
  favoriteWindow.on('closed', (e)=>{
    favoriteWindow=null;
  });
})

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