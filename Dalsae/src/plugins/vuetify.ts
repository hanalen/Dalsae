import Vue from 'vue';
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';
import { VuetifyParsedTheme } from 'vuetify/types/services/theme';

Vue.use(Vuetify);

const theme = ({
  primary: '#4e91a5',
  secondary: '#56aac2',
  accent: '#4098b0',
  error: '#f8645a',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',

  gray: '#828d9b'
} as unknown) as Partial<VuetifyParsedTheme>;

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg'
  },
  theme: {
    dark: false,
    themes: {
      dark: theme
    },
    options: {
      customProperties: true
    }
  }
});
