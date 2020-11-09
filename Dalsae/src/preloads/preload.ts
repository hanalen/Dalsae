import { remote, ipcRenderer, shell } from 'electron';
import Log from 'electron-log';
import path from 'path';
let ipcName = Math.random() * (99999 - 0) + 0;
import ImagePreload from './ImagePreload';
import fs from 'fs-extra';
import * as M from '@/Managers';
import * as I from '@/Interfaces';

const pathData = 'Data/';
const pathSwitter = 'Data/Switter.json';
const pathOption = 'Data/Option.json';

export default class Preload {
  image: ImagePreload = new ImagePreload();
  ClickLink() {
    ipcName = Math.random() * (99999 - 0) + 0;
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: true,
      title: 'image-test',
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        webSecurity: false,
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload')
      }
    });
    console.log(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}test?userid=${ipcName}`);
    v.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: ipcName, value: 'value is ' + ipcName });
    v.on('ready-to-show', () => {
      //show: true일 경우 호출 안 됨
      Log.info('ready to show');
      v.show();
    });
  }

  GetData(userid: any): string {
    //remote.ipcrenderer은 null로 나온다
    Log.info('--------------');
    Log.info('get data'); //testwindow의 preload랑 다른 object!
    Log.info(userid);
    // Log.info(ipcRenderer);
    const v = ipcRenderer.sendSync(userid);
    Log.info('--------------');
    Log.info('synced ipc renderer');
    Log.info(v);
    return v;
  }

  OpenBrowser(url: string) {
    shell.openExternal(url);
  }

  LoadConfig() {
    console.log('load config');
    this.CheckFolder();
  }

  CheckFolder() {
    if (fs.existsSync(pathData) === false) {
      fs.mkdirsSync(pathData);
    }
  }

  LoadSwitter(): I.Switter {
    return this.ReadFile<I.Switter>(pathSwitter);
  }

  LoadOption(): M.OptionManager {
    return this.ReadFile<M.OptionManager>(pathOption);
  }

  ReadFile<T>(path: string): T {
    const ret = fs.readJsonSync(path, { throws: false }) as T;
    return ret;
  }

  SaveSwitter(switter: I.Switter) {
    this.SaveFile(pathSwitter, switter);
  }

  SaveOption(option: M.OptionManager) {
    this.SaveFile(pathOption, option);
  }

  SaveFile(path: string, data: object) {
    fs.writeJSONSync(path, data);
  }
}

type PreloadWindow = typeof window & { preload: Preload };
(window as PreloadWindow).preload = new Preload();
