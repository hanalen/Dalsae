import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
export default class ProfilePreload {
  OpenProfileWindow(userScreenName: string) {
    console.log('open prifle');
    // Log.info('tweet id: ' + tweetId);
    const window = new remote.BrowserWindow({
      show: true,
      title: 'dalsae-profile',
      width: 1900,
      height: 1200,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload')
      }
    });
    window.loadURL(
      `${process.env.WEBPACK_DEV_SERVER_URL as string}ProfileView?screenName=${userScreenName}`
    );
    console.log(
      'url: ',
      `${process.env.WEBPACK_DEV_SERVER_URL as string}ProfileView?screenName=${userScreenName}`
    );
    window.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: `profile_${userScreenName}`, value: userScreenName });
  }
}
