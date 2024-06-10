import { createRouter, createWebHashHistory } from 'vue-router'
import { BrewMethod } from '@/assets/types'
import HomeView from '@/views/HomeView.vue'
import BrewView from '@/views/BrewView.vue'
import AboutView from '@/views/AboutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { gongFuBrewPresets, westernBrewPresets } from '@/assets/presets'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/gong-fu-brew',
      name: 'gong-fu-brew',
      component: BrewView,
      props: {
        method: BrewMethod.GONG_FU,
        customDefaults: {
          initialTime: 20,
          incrementTime: 5,
        },
        presets: gongFuBrewPresets,
      },
    },
    {
      path: '/western-brew',
      name: 'western-brew',
      component: BrewView,
      props: {
        method: BrewMethod.WESTERN,
        customDefaults: {
          initialTime: 120,
          incrementTime: 30,
        },
        presets: westernBrewPresets,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})
