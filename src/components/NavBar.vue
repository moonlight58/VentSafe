<template>
  <div>
    <!-- Bouton hamburger pour mobile -->
    <button
      class="menu-toggle-mobile"
      @click="toggleNavbar"
      :class="{ 'menu-open': isNavbarOpen }"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- Overlay pour fermer le menu en cliquant à côté -->
    <div v-if="isNavbarOpen" class="mobile-overlay" @click="closeNavbar"></div>

    <!-- Navbar principale -->
    <nav class="vertical-navbar" :class="{ 'mobile-open': isNavbarOpen }">
      <div class="navbar-container">
        <!-- En-tête avec logo -->
        <div class="navbar-brand">
          <img src="/cloud.svg" alt="Vent Safe Logo" class="brand-logo" />
          <h2 class="brand-title">Vent Safe</h2>
        </div>

        <!-- Menu principal -->
        <ul class="navbar-menu">
          <li class="menu-item">
            <router-link
              to="/home"
              class="menu-link"
              active-class="active"
              @click="closeNavbar"
            >
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
            <router-link
              to="/vent"
              class="menu-link"
              active-class="active"
              @click="closeNavbar"
            >
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
            <router-link
              to="/profile"
              class="menu-link"
              active-class="active"
              @click="closeNavbar"
            >
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
          <router-link to="/" class="login-link" @click="closeNavbar">
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
            <span class="menu-text">Change User</span>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "VerticalNavbar",
  data() {
    return {
      isNavbarOpen: false,
    };
  },
  methods: {
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
      // Empêcher le scroll du body quand le menu est ouvert sur mobile
      if (this.isNavbarOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    closeNavbar() {
      this.isNavbarOpen = false;
      document.body.style.overflow = "";
    },
    handleResize() {
      // Fermer le menu si on passe en desktop
      if (window.innerWidth > 768 && this.isNavbarOpen) {
        this.closeNavbar();
      }
    },
  },
  mounted() {
    // Animation d'entrée
    this.$nextTick(() => {
      const navbar = this.$el.querySelector(".vertical-navbar");
      navbar.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      setTimeout(() => {
        if (window.innerWidth > 768) {
          navbar.style.transform = "translateX(0)";
        }
      }, 100);
    });

    // Écouter les changements de taille d'écran
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    // Nettoyer les event listeners
    window.removeEventListener("resize", this.handleResize);
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
/* Variables CSS pour cohérence */
/* Bouton hamburger pour mobile */
.menu-toggle-mobile {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.menu-toggle-mobile:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.hamburger-line {
  width: 18px;
  height: 2px;
  background-color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 1px;
}

.menu-toggle-mobile.menu-open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle-mobile.menu-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.menu-toggle-mobile.menu-open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Overlay pour mobile */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9996;
  display: none;
}

/* Navbar principale */
.vertical-navbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 9997;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 0;

  --color-black: #000000;
  --color-white: #ffffff;
  --color-violet: #6366f1;
  --color-orange: #f59e0b;
  --color-green: #10b981;
  --color-pink: #ec4899;
  --color-indigo: #8b5cf6;
  --color-gray: #9ca3af;
}

.navbar-brand {
  padding: 0 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 2rem;
}

.brand-logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.brand-title {
  font-size: 1.5rem;
  color: var(--color-white);
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.02em;
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
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  font-weight: 400;
  position: relative;
}

.menu-link:hover,
.login-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-white);
  transform: translateX(4px);
}

.menu-link.active {
  background: rgba(99, 102, 241, 0.2);
  color: var(--color-white);
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.menu-link.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--color-violet);
  border-radius: 0 2px 2px 0;
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.menu-link:hover .menu-icon,
.login-link:hover .menu-icon {
  transform: scale(1.1);
}

.menu-text {
  font-size: 0.875rem;
  font-weight: 500;
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
  background: rgba(255, 255, 255, 0.05);
}

/* Animation pour les icônes actives */
.menu-link.active .menu-icon {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .menu-toggle-mobile {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .vertical-navbar {
    transform: translateX(-100%);
    width: 280px;
    background: rgba(0, 0, 0, 0.98);
  }

  .vertical-navbar.mobile-open {
    transform: translateX(0);
  }

  .navbar-container {
    padding: 3rem 0 2rem 0;
  }

  .navbar-brand {
    padding: 0 2rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .brand-title {
    font-size: 1.25rem;
  }

  .menu-text {
    font-size: 0.875rem;
  }

  .menu-link,
  .login-link {
    padding: 0.875rem 1.5rem;
  }

  /* S'assurer que tous les éléments sont visibles */
  .menu-item,
  .navbar-brand,
  .navbar-footer {
    opacity: 1;
    visibility: visible;
  }
}

/* Animation d'entrée pour les éléments du menu */
.vertical-navbar.mobile-open .menu-item {
  animation: slideInFromLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.vertical-navbar.mobile-open .menu-item:nth-child(1) {
  animation-delay: 0.1s;
}

.vertical-navbar.mobile-open .menu-item:nth-child(2) {
  animation-delay: 0.2s;
}

.vertical-navbar.mobile-open .menu-item:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Amélioration pour les très petits écrans */
@media (max-width: 480px) {
  .vertical-navbar {
    width: 100vw;
  }

  .menu-toggle-mobile {
    top: 0.75rem;
    left: 0.75rem;
  }
}
</style>
