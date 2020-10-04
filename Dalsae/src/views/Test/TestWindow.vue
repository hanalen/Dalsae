<template>
  <div class="window-area">
    <span>{{ dataValue }}</span>
  </div>
</template>

<script>
export default {
  name: 'TestWindow',
  components: {},
  data: function() {
    return {
      dataValue: {
        type: String,
        default: ''
      }
    };
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
    const value = window.preload.GetData(this.$route.query.userid);
    this.dataValue = value;
    this.$nextTick(() => {
      console.log(this.userid);
      console.log(window.title);
      console.log(window);
    });
  }
};
</script>
