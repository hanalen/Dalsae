<template>
  <div class="window-area">
    <input
      type="button"
      value="너는 새 창을 잘 여는 프렌즈구나?"
      @click="ClickBrowserWindow"
    /><br /><br />
    <input
      type="button"
      value="너는 새 창을 잘 여는 프렌즈구나?"
      @click="ClickBrowserWindow"
    /><br /><br />
    <input
      type="button"
      value="너는 새 창을 잘 여는 프렌즈구나?"
      @click="ClickBrowserWindow"
    /><br /><br />
    <input
      type="button"
      value="너는 새 창을 잘 여는 프렌즈구나?"
      @click="ClickBrowserWindow"
    /><br /><br />
    <input
      type="button"
      value="너는 새 창을 잘 여는 프렌즈구나?"
      @click="ClickBrowserWindow"
    /><br /><br />
  </div>
</template>

<script>
export default {
  name: 'TestWindow',
  components: {},
  data: function() {
    return {};
  },
  props: {
    userid: {
      type: String,
      default: '000'
    },
    test: undefined
  },
  methods: {
    ClickBrowserWindow(e) {
      console.log(e);
      // hotkeyWindow = new BrowserWindow({ show: false, width: 720, height: 590, devTools: false });
      // const path =
      //   process.env.NODE_ENV === 'development'
      //     ? 'http://localhost:9080/#/HotkeyOption'
      //     : `file://${__dirname}/index.html#HotkeyOption`;
      // hotkeyWindow.loadURL(path);
      // hotkeyWindow.on('ready-to-show', () => {
      //   hotkeyWindow.webContents.send('Hotkey', hotkey);
      //   hotkeyWindow.show();
      // });
    }
  },
  created: function() {
    this.$nextTick(() => {
      console.log(this.userid);
      console.log(window.title);
      console.log(window);
    });
  }
};
</script>
