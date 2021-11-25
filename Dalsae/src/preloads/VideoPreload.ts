import { BrowserWindow, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
import http from 'http';
import fs from 'fs';
import Axios from 'axios';
export const videoPreload = {
  OpenVideoWindow(tweet: any, option: I.UIOption, switter: I.Switter) {
    const ipcName = Math.random() * (99999 - 0) + 0;
    const url = `/VideoView?tweetId=${ipcName}`;
    ipcRenderer.send('OpenWindow', {
      url: url,
      title: 'dalsae-video',
      type: 'video',
      ipcName: ipcName
    });
    ipcRenderer.send('RegisterData', { name: `switter_${ipcName}`, data: switter });
    ipcRenderer.send('RegisterData', { name: `option_${ipcName}`, data: option });
    ipcRenderer.send('RegisterData', { name: `tweet_${ipcName}`, data: tweet });
  }
};
