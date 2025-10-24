import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Step1 from '../views/Step1.vue'
import Step2 from '../views/Step2.vue'
import Step3 from '../views/Step3.vue'
import Step3ImageTest from '../views/Step3ImageTest.vue'
import Step3ReviewVote from '../views/Step3ReviewVote.vue'
import Step4 from '../views/Step4.vue'
import Complete from '../views/Complete.vue'
import CompleteFollowUp from '../views/CompleteFollowUp.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/fitbox'
  },
  {
    path: '/:brand',
    name: 'home',
    component: Home
  },
  {
    path: '/:brand/step1',
    name: 'step1',
    component: Step1
  },
  {
    path: '/:brand/step2',
    name: 'step2',
    component: Step2
  },
  {
    path: '/:brand/step3',
    name: 'step3',
    component: Step3
  },
  {
    path: '/:brand/step3-review-vote',
    name: 'step3ReviewVote',
    component: Step3ReviewVote,
  },
  {
    path: '/:brand/step3-image-test',
    name: 'step3ImageTest',
    component: Step3ImageTest,
  },
  {
    path: '/:brand/step4',
    name: 'step4',
    component: Step4
  },
  {
    path: '/:brand/complete',
    name: 'complete',
    component: Complete
  },
  {
    path: '/:brand/complete-follow-up',
    name: 'completeFollowUp',
    component: CompleteFollowUp,
  },
]

const router = new VueRouter({
  scrollBehavior(_to, _from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else {
          resolve({ x: 0, y: 0 })
        }
      }, 200)
    })
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const thisBrand = to.params.brand;
  if (thisBrand) {
    if (store.state.brand == thisBrand) {
      next();
    } else {
      const allBrandNames = store.state.allBrandNames;
      if (allBrandNames.indexOf(thisBrand) >= 0) {
        store.commit('setBrand', thisBrand);
        store.commit('initRandNumber');
        store.dispatch('getProducts', thisBrand);
        next();
      } else {
        next(false);
      }
    }
  } else {
    alert('Invalid');
    next(false);
  }
})

export default router
