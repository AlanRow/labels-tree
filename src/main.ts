import { createApp } from 'vue'
import App from './App.vue'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([AllEnterpriseModule, AllCommunityModule])
LicenseManager.setLicenseKey(import.meta.env.VUE_APP_AG_GRID_LICENSE_KEY)

// global TODOs:
// *) допилить изменяемость
// *) оптимизировать кэширование
// *) стилизовать таблицу под шаблон
// *) экспортировать TreeStore
// *) test coverage
// *) причесать public
// *) декомпозировать
// *) вынести константы, если есть

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule])

createApp(App).mount('#app')
