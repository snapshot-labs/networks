import { createRouter, createWebHistory } from "vue-router";
import NetworkTester from "/src/components/NetworkTester.vue";
import SelectNetworkMessage from "/src/components/SelectNetworkMessage.vue";

const routes = [
  {
    path: "/",
    component: SelectNetworkMessage,
  },
  {
    path: "/:id",
    component: NetworkTester,
  },
  {
    path: "/:catchAll(.*)",
    component: SelectNetworkMessage,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
