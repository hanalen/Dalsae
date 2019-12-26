import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.EventBus = new Vue();  // Vue에 등록
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(VModal, { dynamic: true })

Vue.use(VModal, { componentName: "input-pin" })

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  VModal,
  template: '<App/>'
}).$mount('#app')
