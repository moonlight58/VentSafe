<template>
  <nav class="vertical-navbar">
    <div class="navbar-container">
      <!-- Logo ou titre -->
      <div class="navbar-brand">
        <h2 class="brand-title">App</h2>
      </div>

      <!-- Menu principal -->
      <ul class="navbar-menu">
        <li class="menu-item">
          <router-link to="/home" class="menu-link" active-class="active">
            <svg
              class="menu-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="menu-text">Home</span>
          </router-link>
        </li>

        <li class="menu-item">
          <router-link to="/vent" class="menu-link" active-class="active">
            <svg
              class="menu-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span class="menu-text">Vent</span>
          </router-link>
        </li>

        <li class="menu-item">
          <router-link to="/profile" class="menu-link" active-class="active">
            <svg
              class="menu-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="menu-text">Profil</span>
          </router-link>
        </li>
      </ul>

      <!-- Section de connexion en bas -->
      <div class="navbar-footer">
        <router-link to="/" class="login-link">
          <svg
            class="menu-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <span class="menu-text">Connexion</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "VerticalNavbar",
  mounted() {
    // Animation d'apparition au montage du composant
    this.$nextTick(() => {
      const navbar = this.$el;
      navbar.style.transform = "translateX(-100%)";
      navbar.style.transition = "transform 0.3s ease-out";

      setTimeout(() => {
        navbar.style.transform = "translateX(0)";
      }, 100);
    });
  },
};
</script>

<style scoped>
.vertical-navbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Variables CSS pour cohérence avec la documentation */
  --color-black: #000000;
  --color-white: #ffffff;
  --color-violet: #6366f1;
  --color-orange: #f59e0b;
  --color-green: #10b981;
  --color-pink: #ec4899;
  --color-indigo: #8b5cf6;
  --color-gray: #9ca3af;
}

.navbar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 0;
}

.navbar-brand {
  padding: 0 1.5rem 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.brand-title {
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0;
  text-align: center;
}

.navbar-menu {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  padding: 0 1rem;
}

.menu-link,
.login-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--color-white);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 400;
}

.menu-link:hover,
.login-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(8px);
}

.menu-link.active {
  background-color: var(--color-violet);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-text {
  font-size: 0.875rem;
}

.navbar-footer {
  padding: 2rem 1rem 0 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.login-link {
  color: var(--color-gray);
  justify-content: center;
}

.login-link:hover {
  color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.05);
}

/* Animation pour les icônes */
.menu-link:hover .menu-icon,
.login-link:hover .menu-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .vertical-navbar {
    width: 240px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-out;
  }

  .vertical-navbar.mobile-open {
    transform: translateX(0);
  }

  .menu-text {
    font-size: 0.75rem;
  }

  .brand-title {
    font-size: 1.125rem;
  }
}

/* Animation pour les éléments au survol */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.menu-link.active .menu-icon {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
