import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupProviders } from './app/providers'

const app = createApp(App)
setupProviders(app)
app.mount('#app')
