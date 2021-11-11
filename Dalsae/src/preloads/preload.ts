import { contextBridge, BrowserWindow, ipcRenderer, shell, ipcMain } from 'electron';
import Log from 'electron-log';
import path from 'path';
const ipcName = Math.random() * (99999 - 0) + 0;
import { imagePreload } from './ImagePreload';
import fs from 'fs-extra';
import * as I from '@/Interfaces';
import { IOptionStore } from '@/store/modules/OptionStore';
import { profilePreload } from './ProfilePreload';
import { videoPreload } from './VideoPreload';
import http from 'http';

const pathData = 'Data/';
const pathSwitter = 'Data/Switter.json';
const pathOption = 'Data/Option.json';
const pathBlockids = 'Data/block.json';

function CheckFolder() {
  if (fs.existsSync(pathData) === false) {
    fs.mkdirsSync(pathData);
  }
}

function ReadFile<T>(path: string): T {
  const ret = fs.readJsonSync(path, { throws: false }) as T;
  return ret;
}

function SaveFile(path: string, data: object) {
  fs.writeJSONSync(path, data);
}

//window에서 node 접근 가능하게 해주는 변수
const files = {
  LoadSwitter(): I.Switter {
    return ReadFile<I.Switter>(pathSwitter);
  },
  LoadConfig() {
    CheckFolder();
  },
  LoadOption(): IOptionStore {
    return ReadFile<IOptionStore>(pathOption);
  },
  LoadBlock(): string[] {
    return this.ReadFile<string[]>(pathBlockids);
  },
  ReadFile<T>(path: string): T {
    const ret = fs.readJsonSync(path, { throws: false }) as T;
    return ret;
  },
  SaveSwitter(switter: I.Switter) {
    SaveFile(pathSwitter, switter);
  },
  SaveOption(option: IOptionStore) {
    SaveFile(pathOption, option);
  },
  SaveBlocks(ids: string[]) {
    SaveFile(pathBlockids, ids);
  },
  LoadTestTweet(): I.Tweet[] {
    const ret = fs.readJsonSync('Data/testqt.json');
    return ret;
  },
  LoadTestFriends(): I.User[] {
    const ret = fs.readJSONSync('Data/following.json');
    return ret;
  },
  LoadTestFollower(): I.User[] {
    const ret = fs.readJSONSync('Data/follower.json');
    return ret;
  },
  LoadTestImageTweet(): I.Tweet {
    const ret = fs.readJsonSync('Data/imagetest.json');
    return ret;
  },
  LoadTestDM(): I.DMList {
    const ret = fs.readJSONSync('Data/dmList.json');
    return ret;
  }
};

const browser = {
  OpenBrowser(url: string) {
    shell.openExternal(url);
  }
};

//vue 윈도우에서 콜백 받을 때 사용, 윈도우->send->mainprocess에서 on->ipc.on 콜->메인윈도우에 콜백
const ipcPipe = {
  send: (channel: string, data: object) => {
    console.log('chaneel send', data);
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: (data: object) => void) => {
    ipcRenderer.on(channel, (event, args) => callback({ ...args }));
  }
};

export const ipc = {
  files: files,
  ipcPipe: ipcPipe,
  browser: browser,
  image: imagePreload,
  profile: profilePreload,
  video: videoPreload
};
contextBridge.exposeInMainWorld('ipc', ipc);
