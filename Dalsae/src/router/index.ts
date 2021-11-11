import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import ImageView from '@/views/ImageView.vue';
import ProfileView from '@/views/ProfileView.vue';
import VideoView from '@/views/VideoView.vue';

function register() {
  const files = require.context('../', true, /\.vue$/i);
  files
    .keys()
    .map(key => Vue.component((key.split('/').pop() || '').split('.')[0], files(key).default));
}

register();

Vue.use(VueRouter);
export const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ImageView',
    name: 'ImageView',
    component: ImageView,
    props: route => ({ tweetId: route.params })
  },
  {
    path: '/VideoView',
    name: 'VideoView',
    component: VideoView,
    props: route => ({ tweetId: route.params })
  },
  {
    path: '/ProfileView',
    name: 'ProfileView',
    component: ProfileView,
    props: route => ({ screenName: route.params })
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
