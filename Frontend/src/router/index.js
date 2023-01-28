import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserProfileView.vue'
import AdminView from '../views/AdminView.vue'
import LectureView from '../views/LectureView.vue'
import QuestionView from '../views/QuestionsView.vue'
import LoginView from '../views/LoginView.vue'
import PageNot from '../views/PageNotFound.vue'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/lectures/:lecid',
      name: 'Lectures',
      component: LectureView,
      beforeEnter: (to, from) => {
        to.params.lecid = parseInt(to.params.lecid);
        if (!to.params.lecid){
          return '/lectures'
        }
    },
      props: true
    },
    {
      path: '/questions',
      name: 'Questions',
      component: QuestionView
    },
    {
      path: '/login',
      name: 'LogIn',
      component: async () => {
        let user = Cookies.get('name')
        if(user){
          return HomeView
        }else {
          return LoginView
        }
      }
    },
    {
      path: '/dashboard',
      name: 'Profile',
      component: async () => {
        let user = Cookies.get('name')
        if(user === 'admin'){
          return AdminView
        }else {
          return UserView
        }
      }
    },
    {
      path: '/:path(.*)*',
      name: 'Not Found',
      component: PageNot
    }
  ]
})

router.beforeEach(async (to, from) => {
  if(!Cookies.get('name')){
    if (to.path !== '/login') {
      return '/login';
    }
  }else if (to.path === '/login'){
    return '/';
  }
});

export default router
