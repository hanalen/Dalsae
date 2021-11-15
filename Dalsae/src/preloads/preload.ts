import { contextBridge, ipcRenderer, shell } from 'electron';
import { imagePreload } from './ImagePreload';
import fs from 'fs-extra';
import * as I from '@/Interfaces';
import { IOptionStore } from '@/store/modules/OptionStore';
import { profilePreload } from './ProfilePreload';
import { videoPreload } from './VideoPreload';
import { EIPcType } from '@/mixins';

const pathData = '/Data/';
const pathSound = '/Sound/';
const pathSwitter = '/Data/Switter.json';
const pathOption = '/Data/Option.json';
const pathBlockids = '/Data/block.json';

let appPath = '';
ipcRenderer.once('GetAppPath', (event, path: string) => {
  appPath = path;
});
ipcRenderer.send('GetAppPath');

function CheckFolder() {
  if (fs.existsSync(appPath + pathData) === false) {
    fs.mkdirsSync(appPath + pathData);
  }
  if (fs.existsSync(appPath + pathSound) === false) {
    fs.mkdirsSync(appPath + pathSound);
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
  GetAppPath(): string {
    return appPath;
  },
  LoadSwitter(): I.Switter {
    return ReadFile<I.Switter>(appPath + pathSwitter);
  },
  LoadConfig() {
    CheckFolder();
  },
  LoadOption(): IOptionStore {
    return ReadFile<IOptionStore>(appPath + pathOption);
  },
  LoadBlock(): string[] {
    return this.ReadFile<string[]>(appPath + pathBlockids);
  },
  ReadFile<T>(path: string): T {
    const ret = fs.readJsonSync(path, { throws: false }) as T;
    return ret;
  },
  SaveSwitter(switter: I.Switter) {
    SaveFile(appPath + pathSwitter, switter);
  },
  SaveOption(option: IOptionStore) {
    SaveFile(appPath + pathOption, option);
  },
  SaveBlocks(ids: string[]) {
    SaveFile(appPath + pathBlockids, ids);
  },
  LoadTestTweet(): I.Tweet[] {
    const ret = fs.readJsonSync(appPath + '/Data/testqt.json');
    return ret;
  },
  LoadTestFriends(): I.User[] {
    const ret = fs.readJSONSync(appPath + '/Data/following.json');
    return ret;
  },
  LoadTestFollower(): I.User[] {
    const ret = fs.readJSONSync(appPath + '/Data/follower.json');
    return ret;
  },
  LoadTestImageTweet(): I.Tweet {
    const ret = fs.readJsonSync(appPath + '/Data/imagetest.json');
    return ret;
  },
  LoadTestDM(): I.DMList {
    const ret = fs.readJSONSync(appPath + '/Data/dmList.json');
    return ret;
  },
  GetSoundFiles(): string[] {
    const ret = fs.readdirSync(appPath + pathSound);
    return ret;
  },
  OpenSoundFolder() {
    shell.openExternal(appPath + pathSound);
  }
};

const browser = {
  OpenBrowser(url: string) {
    shell.openExternal(url);
  }
};

//vue 윈도우에서 콜백 받을 때 사용, 윈도우->send->mainprocess에서 on->ipc.on 콜->메인윈도우에 콜백
const ipcPipe = {
  alarm: () => {
    ipcRenderer.send('MainWindowAlarm');
  },
  send: (channel: EIPcType, data: any) => {
    ipcRenderer.send('AddChannelOn', { name: channel, data: data, value: '' });
  },
  on: (channel: string, callback: (data: any) => void) => {
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
