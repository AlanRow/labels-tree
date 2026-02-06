import { createApp } from 'vue'
import App from './App.vue'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

ModuleRegistry.registerModules([AllEnterpriseModule, AllCommunityModule])
LicenseManager.setLicenseKey(import.meta.env.VUE_APP_AG_GRID_LICENSE_KEY)

const app = createApp(App)

// Element Plus для UI-стилизации
app.use(ElementPlus)

app.mount('#app')
