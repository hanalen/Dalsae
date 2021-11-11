import { BrowserWindow, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
import { FollowDatas } from '@/Interfaces/DalsaeDatas/FollowDatas';

export const profilePreload = {
  OpenProfileWindow(
    screenName: string,
    switter: I.Switter,
    followDatas: I.FollowDatas,
    blockIds: string[]
  ) {
    const url = `${process.env
      .WEBPACK_DEV_SERVER_URL as string}ProfileView?screenName=${screenName}`;
    ipcRenderer.send('OpenWindow', { url: url, title: 'dalsae-profile' });
    ipcRenderer.send('AddChannel', { name: `switter_${screenName}`, value: switter });
    ipcRenderer.send('AddChannel', { name: `followdatas_${screenName}`, value: followDatas });
    ipcRenderer.send('AddChannel', { name: `blokcids_${screenName}`, value: blockIds });
  },

  GetSwitter(screenName: string) {
    const switter: I.Switter = ipcRenderer.sendSync('switter_' + screenName);
    return switter;
  },

  GetFollowDatas(screenName: string) {
    const followDatas: I.FollowDatas = ipcRenderer.sendSync('followdatas_' + screenName);
    return followDatas;
  },

  GetBlockIds(screenName: string) {
    const blockIds: string[] = ipcRenderer.sendSync('blokcids_' + screenName);
    return blockIds;
  }
};
