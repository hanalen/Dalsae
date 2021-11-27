import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { Breadcrumb } from '@sentry/vue';
// import {Integrations} from '@sentry/node';

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
Sentry.init({
  Vue,
  maxBreadcrumbs: 4,
  dsn: 'https://98af9300813e4906ab16aa0a336be0bd@o146584.ingest.sentry.io/6083906',
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'my-site-url.com', /^\//],
      traceXHR: false
    })
  ],
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category !== 'console') return null;
    else {
      return breadcrumb;
    }
  },
  beforeSend: (e: Sentry.Event, hint: Sentry.EventHint) => {
    if (e.user) {
      delete e.user;
    }
    if (e.platform) {
      delete e.platform;
    }
    return e;
  },
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
