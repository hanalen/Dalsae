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
    blockIds: Map<bigint, I.BlockIdsBigInt>
  ) {
    const url = `/ProfileView?screenName=${screenName}`;

    ipcRenderer.send('OpenWindow', {
      url: url,
      title: 'dalsae-profile',
      type: 'profile',
      ipcName: screenName
    });
    ipcRenderer.send('RegisterData', { name: `switter_${screenName}`, data: switter });
    ipcRenderer.send('RegisterData', { name: `followdatas_${screenName}`, data: followDatas });
    ipcRenderer.send('RegisterData', { name: `blokcids_${screenName}`, data: blockIds });
  }
};
