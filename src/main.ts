import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia'
import piniaPluginPersist from "pinia-plugin-persist";

let elementApp = createApp(App);
const createpinia = createPinia();
createpinia.use(piniaPluginPersist)
elementApp.use(router).use(createpinia).mount('#app')
