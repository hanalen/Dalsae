import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Image from '@/views/Dialogs/Image/ImageWindow.vue';

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
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/Test/TestWindow.vue'),
  //   props: route => ({ userid: route.params })
  //   // props: true
  // },
  {
    path: '/Image',
    name: 'Image',
    component: Image,
    props: route => ({ tweetId: route.params })
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
