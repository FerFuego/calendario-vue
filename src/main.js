import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueTextareaAutosize from 'vue-textarea-autosize'
Vue.use(VueTextareaAutosize)

////////////////////////////////////////////////////////////
//Firebaseapp
////////////////////////////////////////////////////////////
import firebase from "firebase/app";
import 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHMw1Ug7mc0MQe4CDdfDdwfRlSKU3a_Nc",
  authDomain: "vue-calendario-af7a4.firebaseapp.com",
  projectId: "vue-calendario-af7a4",
  storageBucket: "vue-calendario-af7a4.appspot.com",
  messagingSenderId: "558015269630",
  appId: "1:558015269630:web:1951681ffb893cf7fdf3af"
};

// Initialize Firebase
// npm install firebase@4.12.0 --save // Esta version fuinciona la mas nueva (v9) no funciona
const app = initializeApp(firebaseConfig);
export const db = app.firestore();
////////////////////////////////////////////////////////////

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
