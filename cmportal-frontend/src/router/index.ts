import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
const userStore = getModule(user);
const routes: Array<RouteRecordRaw> =[
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/restrictionat',
    name: 'AccesBlocat',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/AccesBlocat.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Login/Login.vue'),
  },  
  {
    path: '/reset_password',
    name: 'ResetPassword',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/ResetPassword/ResetPassword.vue'),
  },
  {
    path: '/myprofile',
    name: 'MyProfile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/MyProfile/MyProfile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Dashboard/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/users/:companyAppid',
    name: 'AdminUsers',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Admin/Users/Users.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/category',
    name: 'AdminCategory',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Admin/AdminCategory/AdminCategory.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/tipuri',
    name: 'AdminTipuri',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Admin/AdminTipuri/AdminTipuri.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/articles',
    name: 'AdminArticles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Admin/AdminArticles/AdminArticles.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/companies',
    name: 'AdminCompanies',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Admin/AdminCompanies/AdminCompanies.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/system_parameters',
    name: 'AdminSystemParameters',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Admin/AdminSystemParameters/AdminSystemParameters.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/browse_articles/:pidCategory',
    name: 'BrowseArticles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/BrowseArticles/BrowseArticles.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/browse_categories/:pid',
    name: 'BrowseCategories',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/BrowseCategories/BrowseCategories.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/firstpageafterpushoffer/:pidOffer',
    name: 'FirstPageAfterPushOffer',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/FirstPageAfterPushOffer/FirstPageAfterPushOffer.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/cerere/:pidOffer',
    name: 'Cerere',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Cerere/Cerere.vue'),
    props: (route) => ({ propOfferId: route.params.pidOffer }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/oferta/:pidOffer',
    name: 'Oferta',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Oferta/Oferta.vue'),
    props: (route) => ({ propOfferId: route.params.pidOffer }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/offers',
    name: 'Offers',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Offers/Offers.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/facturi',
    name: 'Facturi',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Facturi/Facturi.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/balanta',
    name: 'Balanta',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Balanta/Balanta.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/date_companie',
    name: 'DateCompanie',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/DateCompanie/DateCompanie.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/articole_favorite',
    name: 'ArticoleFavorite',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/ArticoleFavorite/ArticoleFavorite.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/documente',
    name: 'Documente',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Documente/Documente.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/users_companie',
    name: 'UsersCompany',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/UsersCompany/UsersCompany.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/my_shopping_cart',
    name: 'MyShoppingCart',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/MyShoppingCart/MyShoppingCart.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/adrese_livrare',
    name: 'AdreseLivrare',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/AdreseLivrare/AdreseLivrare.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path : '/alerte',
    name : 'Alerte',
    component: () => import(/* webpackChunkName: "about" */ '../pages/Alerte/Alerte.vue')
  }
]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach route')
  
  if(from.name){
    userStore.set_previous_route_name(from.name)
  }

  //window.scrollTo(0, 0);
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('isAuthenticatedUser') == null || !userStore.userIsAuthenticated) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})



export default router
