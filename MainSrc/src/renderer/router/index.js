import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
       path: '/Image',
       name:'Image',
       component: require('@/components/Modals/ImagePopup').default, 
       props: (route) => ({ query: route.query.id }) 
    },
    {
      path: '/MuteOption',
      name:'MuteOption',
      component: require('@/components/Modals/MuteOptionPopup').default, 
    },
    {
      path: '/HotkeyOption',
      name:'HotkeyOption',
      component: require('@/components/Modals/HotkeyPopup').default, 
    },
    {
      path: '/Profile',
      name:'Profile',
      component: require('@/components/Modals/ProfilePopup').default, 
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
