module.exports = {
  pluginOptions: {
    builderOptions: {},
    electronBuilder: {
      outputDir: 'electron-builder-output-dir',
      preload: 'src/preloads/preload.ts',
      chainWebpackMainProcess: config => {
        // Chain webpack config for electron main process only
      },
      chainWebpackRendererProcess: config => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
        config.plugin('define').tap(args => {
          args[0]['IS_ELECTRON'] = true;
          return args;
        });
      },
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: false,

      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/background.ts'
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      // mainProcessWatch: ['src/myFile1', 'src/myFile2'],
      // Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      // mainProcessArgs: ['--arg-name', 'arg-value']
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    // These are some necessary steps changing the default webpack config of the Vue CLI
    // that need to be changed in order for Typescript based components to generate their
    // declaration (.d.ts) files.
    //
    // Discussed here https://github.com/vuejs/vue-cli/issues/1081
    if (process.env.NODE_ENV === 'production') {
      config.module.rule('vue').uses.delete('cache-loader');
      config.module.rule('js').uses.delete('cache-loader');
      config.module.rule('ts').uses.delete('cache-loader');
      config.module.rule('tsx').uses.delete('cache-loader');
    }
  },
  parallel: false
};
