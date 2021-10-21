import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
import { FollowDatas } from '@/Interfaces/DalsaeDatas/FollowDatas';
export default class ProfilePreload {
  OpenProfileWindow(
    screenName: string,
    switter: I.Switter,
    followDatas: I.FollowDatas,
    blockIds: string[]
  ) {
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
    window.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: `switter_${screenName}`, value: switter });
    ipcRenderer.send('AddChannel', { name: `followdatas_${screenName}`, value: followDatas });
    ipcRenderer.send('AddChannel', { name: `blokcids_${screenName}`, value: blockIds });
  }

  GetSwitter(screenName: string) {
    const switter: I.Switter = ipcRenderer.sendSync('switter_' + screenName);
    return switter;
  }

  GetFollowDatas(screenName: string) {
    const followDatas: I.FollowDatas = ipcRenderer.sendSync('followdatas_' + screenName);
    return followDatas;
  }

  GetBlockIds(screenName: string) {
    const blockIds: string[] = ipcRenderer.sendSync('blokcids_' + screenName);
    return blockIds;
  }
}
