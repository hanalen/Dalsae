import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
export default class ProfilePreload {
  OpenProfileWindow(screenName: string, switter: I.Switter) {
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
      `${process.env.WEBPACK_DEV_SERVER_URL as string}ProfileView?screenName=${screenName}`
    );
    console.log(
      'url: ',
      `${process.env.WEBPACK_DEV_SERVER_URL as string}ProfileView?screenName=${screenName}`
    );
    window.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: `switter_${screenName}`, value: switter });
  }

  GetSwitter(screenName: string) {
    const switter: I.Switter = ipcRenderer.sendSync('switter_' + screenName);
    return switter;
  }
}
