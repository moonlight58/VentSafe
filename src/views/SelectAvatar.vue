<template>
  <div class="app-container">
    <!-- Animated background -->
    <div class="background">
      <!-- Stars -->
      <div v-for="star in stars" :key="star.id" class="star" :style="{
        left: star.x + '%',
        top: star.y + '%',
        width: star.size + 'px',
        height: star.size + 'px',
        animationDelay: star.delay + 's',
        animationDuration: star.duration + 's'
      }"></div>

      <!-- Floating colored shapes -->
      <div v-for="shape in shapes" :key="shape.id" class="floating-shape" :style="{
        width: shape.size + 'px',
        height: shape.size + 'px',
        left: shape.x + '%',
        top: shape.y + '%',
        backgroundColor: shape.color,
        animation: `float-${shape.id} ${shape.duration}s ease-in-out infinite`
      }"></div>
    </div>

    <div class="main-container">
      <!-- Selected user display -->
      <div v-if="isUserSelected && selectedUser" class="selected-user-banner">
        <div class="selected-user-content">
          <img :src="selectedUser.avatar" :alt="selectedUser.name" class="selected-avatar"
            :style="{ backgroundColor: selectedUser.color + '33' }" />
          <div class="selected-user-info">
            <p class="selected-user-text">Welcome back, <span class="selected-user-name">{{ selectedUser.name }}</span>
            </p>
          </div>
          <button @click="clearSelectedUser" class="clear-button" title="Change user">
            ×
          </button>
        </div>
      </div>

      <div class="header">
        <h1 class="title">Choose Your Identity</h1>
        <p class="subtitle">{{ isUserSelected ? 'Change your selection' : 'Select who you are today' }}</p>
      </div>

      <div class="users-list">
        <div v-for="user in users" :key="user.id" @click="selectUser(user)" class="user-card"
          :class="{ 'selected': selectedUser && selectedUser.id === user.id, 'selecting': selectingUserId === user.id }">
          <div class="user-content">
            <div class="avatar-container">
              <img :src="user.avatar" :alt="user.name" class="avatar" :style="{ backgroundColor: user.color + '33' }"
                @error="handleImageError" />
              <!-- Fallback avatar if image fails to load -->
              <div v-if="failedImages.includes(user.id)" class="avatar fallback-avatar"
                :style="{ backgroundColor: user.color }">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ user.name }}</h3>
              <p class="user-description">{{ user.description }}</p>
            </div>
            <div class="divider"></div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p class="footer-text">BUILT ON TRUST</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import moonAvatar from '@/assets/pfp/moon.webp'
import kouromoAvatar from '@/assets/pfp/kouromo.webp'

import { useRouter } from 'vue-router'

const router = useRouter()

// User data - embedded directly to avoid import issues
const users = ref([
  {
    id: 1,
    name: "Moon",
    avatar: moonAvatar,
    color: "#6366f1",
    description: "Dreamer of night thoughts"
  },
  {
    id: 2,
    name: "Kouromo",
    avatar: kouromoAvatar,
    color: "#f59e0b",
    description: "Bright energy and warmth"
  }
])

// Animated background elements
const stars = ref([])
const shapes = ref([])
const failedImages = ref([])

// Selected user state (in-memory storage for demo)
const selectedUser = ref(null)
const isUserSelected = ref(false)
const selectingUserId = ref(null)

// Storage functions (in-memory for demo - replace with localStorage in your app)
const saveSelectedUser = (user) => {
  localStorage.setItem('selectedUser', JSON.stringify(user))

  console.log('User saved:', user)
}

const loadSelectedUser = () => {
  const saved = localStorage.getItem('selectedUser')
  return saved ? JSON.parse(saved) : null
}

const clearSelectedUser = () => {
  localStorage.removeItem('selectedUser')
}

// Navigation functions
const redirectToDashboard = () => {
  router.push('/dashboard')
}

// Generate random stars
const generateStars = () => {
  for (let i = 0; i < 50; i++) {
    stars.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2
    })
  }
}

// Generate floating shapes
const generateShapes = () => {
  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6']
  for (let i = 0; i < 8; i++) {
    shapes.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 15
    })
  }
}
onMounted(async () => {

  generateStars()
  generateShapes()

  // Check if user was previously selected
  const savedUser = loadSelectedUser()
  if (savedUser) {
    selectedUser.value = savedUser
    isUserSelected.value = true
  }

  // Generate dynamic CSS for floating animations
  const style = document.createElement('style')
  let css = ''

  shapes.value.forEach(shape => {
    css += `
    @keyframes float-${shape.id} {
      0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
      25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
      50% { transform: translateY(-10px) translateX(-15px) rotate(180deg); }
      75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
    }`
  })

  style.textContent = css
  document.head.appendChild(style)
})

const selectUser = (user) => {
  console.log('Selected user:', user)
  selectingUserId.value = user.id // Show selecting state
  
  saveSelectedUser(user)
  isUserSelected.value = true
  
  // Show success message briefly then redirect
  setTimeout(() => {
    console.log('Redirecting to dashboard...')
    redirectToDashboard()
  }, 800) // Small delay for animation
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

.main-container {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 10;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 100;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.5s ease;
  position: relative;
}

.user-card:hover {
  background-color: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.user-card.selected {
  background-color: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
}

.user-card.selected::before {
  content: '✓';
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #6366f1;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  position: relative;
  width: 3rem;
  height: 3rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
}

.fallback-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  background-color: var(--user-color);
}

.user-card:hover .avatar {
  border-color: rgba(255, 255, 255, 0.3);
}

.user-info {
  flex: 1;
  text-align: left;
}

.user-name {
  color: white;
  font-weight: 100;
  font-size: 1.125rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.user-description {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.divider {
  width: 1px;
  height: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.user-card:hover .divider {
  background-color: rgba(255, 255, 255, 0.3);
}

.footer {
  margin-top: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.5rem;
}

.footer-text {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
}

.selected-user-banner {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(245, 158, 11, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.selected-user-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selected-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.selected-user-info {
  flex: 1;
}

.selected-user-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

.selected-user-name {
  color: white;
  font-weight: 500;
}

.clear-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.clear-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.1);
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

/* Hide scrollbars but keep functionality */
::-webkit-scrollbar {
  display: none;
}

/* Responsive */
@media (max-width: 480px) {
  .main-container {
    padding: 1.5rem;
    margin: 0.5rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .user-card {
    padding: 1rem;
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
  }

  .avatar-container {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>