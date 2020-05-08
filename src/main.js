import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";

Vue.use(ViewUI);

Vue.config.productionTip = false;

Vue.prototype.$Message.config({
  top: 150,
  duration: 5
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
