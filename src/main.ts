import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import "ant-design-vue/dist/antd.css";
import 'nprogress/nprogress.css';

import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.use(ElementPlus)
app.use(UndrawUi)
app.mount('#app')
