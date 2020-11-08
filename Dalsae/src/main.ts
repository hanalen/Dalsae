import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

function register() {
  const files = require.context('./', true, /\.vue$/i);
  files
    .keys()
    .map(key => Vue.component((key.split('/').pop() || '').split('.')[0], files(key).default));
}

// Vue 컴포넌트를 자동으로 등록
register();

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
