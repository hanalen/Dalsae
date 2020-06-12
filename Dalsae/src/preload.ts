import { remote } from 'electron';

export default class Preload {
  asdf() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow();
    v.show();
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
