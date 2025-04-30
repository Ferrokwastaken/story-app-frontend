import { createRouter, createWebHistory } from "vue-router"; // Provided by Vue Router
import MainPage from "../components/MainPage.vue";
import CreateStoryForm from "../components/CreateStoryForm.vue";
import ShowStory from "../components/ShowStory.vue";
import ModeratorLogin from "@/components/ModeratorLogin.vue";

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
  {
    path: '/stories/:uuid',
    name: 'Show',
    component: ShowStory,
  },
  {
    path: '/moderator/login',
    name: 'ModeratorLogin',
    component: ModeratorLogin,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
