import { createApp } from 'vue'
import MDBVue from 'mdbvue'

import App from './App.vue'
import router from './router'


const app = createApp(App)


app.use(router)
app.use(MDBVue)

app.mount('#app')
