import { createRouter, createWebHistory } from 'vue-router';

// Import views
import SelectAvatar from '../views/SelectAvatar.vue';
import DashBoard from '../views/DashBoard.vue';
import ProfileView from '../views/ProfileView.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'SelectAvatar',
    component: SelectAvatar,
  },
  {
    path: '/vent',
    name: 'vent',
    component: DashBoard,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Export the router instance
export default router;
