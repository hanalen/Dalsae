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
       component: require('@/components/Modals/ImageModal').default, 
       props: (route) => ({ query: route.query.id }) 
    },
    // {
    //   path:'/image',
    //   name:'image',
    //   component:require('@/components/Modals/ImageModal').default,
    //   props:true,
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
