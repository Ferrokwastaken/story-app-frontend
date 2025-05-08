import { reactive } from "vue";

export const authState = reactive({
  isLoggedIn: false,
  username: null,
})