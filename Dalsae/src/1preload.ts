import { remote, ipcMain, ipcRenderer } from 'electron';
import router from './router';

export default class Preload {
  ClickLink() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: true,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION
        // preload: path.join(__dirname, 'preload')
      }
    });
    // router.push()
    // v.loadURL(URL.format());
    console.log(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.webContents.openDevTools();
    console.log('before ready', Date.now());

    v.on('show', () => {
      console.log('shown', Date.now());
    });
    v.on('ready-to-show', () => {
      console.log('show!');
      console.log('after ready', Date.now());
      console.log(Date.now());
      // v.show();
    });
  }
  asdf2() {
    console.log('asdfasdf');
  }
  asdf3() {
    console.log('asdfasdf');
  }
  asdf4() {
    console.log('asdfasdf');
  }
}

window.preload = new Preload();
