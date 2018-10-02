import Vue from 'vue'
import App from './App.vue'

window.axios = require('axios');
//window.api_url = 'http://localhost:3000'
window.api_url = 'https://cctec-2018-nodejs.herokuapp.com'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
