import { createRouter, createWebHistory } from "vue-router"; // Provided by Vue Router
import MainPage from "../components/MainPage.vue";
import CreateStoryForm from "../components/CreateStoryForm.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainPage,
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateStoryForm,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
