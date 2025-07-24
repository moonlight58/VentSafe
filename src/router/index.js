import { createRouter, createWebHistory } from 'vue-router';

// Import views
import SelectAvatar from '../views/SelectAvatar.vue';
import DashBoard from '../views/DashBoard.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'SelectAvatar',
    component: SelectAvatar,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashBoard,
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Export the router instance
export default router;
