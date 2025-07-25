<template>
  <div class="app-container">
    <!-- Animated background -->
    <div class="background">
      <!-- Stars -->
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's',
        }"
      ></div>

      <!-- Floating colored shapes -->
      <div
        v-for="shape in shapes"
        :key="shape.id"
        class="floating-shape"
        :style="{
          width: shape.size + 'px',
          height: shape.size + 'px',
          left: shape.x + '%',
          top: shape.y + '%',
          backgroundColor: shape.color,
          animation: `float-${shape.id} ${shape.duration}s ease-in-out infinite`,
        }"
      ></div>
    </div>

    <div class="main-container">
      <!-- Selected user display -->
      <div v-if="isUserSelected && selectedUser" class="selected-user-banner">
        <div class="selected-user-content">
          <img
            :src="selectedUser.avatar"
            :alt="selectedUser.name"
            class="selected-avatar"
            :style="{ backgroundColor: selectedUser.color + '33' }"
          />
          <div class="selected-user-info">
            <p class="selected-user-text">
              Bienvenue,
              <span class="selected-user-name">{{ selectedUser.name }}</span>
            </p>
          </div>
        </div>
        <button @click="clearSelection" class="clear-button">×</button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement des utilisateurs...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Erreur de connexion</h2>
        <p class="error-description">{{ error }}</p>
        <button @click="retryLoading" class="retry-btn">Réessayer</button>
      </div>

      <!-- Main content -->
      <div v-else>
        <div class="header">
          <h1 class="title">Choisissez Votre Identité</h1>
          <p class="subtitle">
            {{
              isUserSelected
                ? "Changez votre sélection"
                : "Sélectionnez qui vous êtes aujourd'hui"
            }}
          </p>
        </div>

        <!-- Users list -->
        <div class="users-list">
          <div
            v-for="user in users"
            :key="user.firebaseId || user.id"
            @click="selectUser(user)"
            class="user-card"
            :class="{
              selected:
                selectedUser &&
                (selectedUser.firebaseId === user.firebaseId ||
                  selectedUser.id === user.id),
              selecting: selectingUserId === (user.firebaseId || user.id),
            }"
          >
            <div class="user-content">
              <div class="avatar-container">
                <img
                  :src="user.avatar"
                  :alt="user.name"
                  class="avatar"
                  :style="{ backgroundColor: user.color + '33' }"
                  @error="handleImageError"
                />
                <!-- Fallback avatar if image fails to load -->
                <div
                  v-if="failedImages.includes(user.firebaseId || user.id)"
                  class="avatar fallback-avatar"
                  :style="{ backgroundColor: user.color }"
                >
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.name }}</h3>
                <p class="user-description">{{ user.description }}</p>
                <!-- User stats from Firebase -->
                <div v-if="user.stats" class="user-stats">
                  <span class="stat-item"
                    >{{ user.stats.totalPosts || 0 }} posts</span
                  >
                  <span class="stat-separator">•</span>
                  <span class="stat-item"
                    >Depuis {{ user.stats.joinDate || "récemment" }}</span
                  >
                </div>
              </div>
              <div class="divider"></div>
            </div>
          </div>
        </div>

        <!-- Add new user section -->
        <div class="add-user-section">
          <button
            @click="showAddUserForm = !showAddUserForm"
            class="add-user-toggle"
          >
            <span v-if="!showAddUserForm">+ Ajouter un utilisateur</span>
            <span v-else>× Annuler</span>
          </button>

          <!-- Add user form -->
          <div v-if="showAddUserForm" class="add-user-form">
            <div class="form-field">
              <label class="form-label">Nom</label>
              <input
                v-model="newUser.name"
                type="text"
                class="form-input"
                placeholder="Entrez un nom"
              />
            </div>

            <div class="form-field">
              <label class="form-label">Description</label>
              <input
                v-model="newUser.description"
                type="text"
                class="form-input"
                placeholder="Décrivez-vous en quelques mots"
              />
            </div>

            <div class="form-field">
              <label class="form-label">Avatar URL</label>
              <input
                v-model="newUser.avatar"
                type="url"
                class="form-input"
                placeholder="https://..."
              />
            </div>

            <div class="form-field">
              <label class="form-label">Couleur</label>
              <div class="color-picker">
                <div
                  v-for="color in availableColors"
                  :key="color"
                  @click="newUser.color = color"
                  class="color-option"
                  :class="{ selected: newUser.color === color }"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
            </div>

            <div class="form-actions">
              <button
                @click="createNewUser"
                :disabled="!canCreateUser || creatingUser"
                class="create-btn"
              >
                <span v-if="creatingUser" class="creating-text">
                  <div class="spinner"></div>
                  Création...
                </span>
                <span v-else>Créer l'utilisateur</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="footer-text">SYNCHRONISÉ EN TEMPS RÉEL</p>
          <div class="sync-indicator" :class="{ synced: !loading }">
            <div class="sync-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { firebaseService } from "@/services/firebase";

const router = useRouter();

// Reactive data
const users = ref([]);
const stars = ref([]);
const shapes = ref([]);
const failedImages = ref([]);
const loading = ref(true);
const error = ref(null);

// Selected user state
const selectedUser = ref(null);
const isUserSelected = ref(false);
const selectingUserId = ref(null);

// Add user form
const showAddUserForm = ref(false);
const creatingUser = ref(false);
const newUser = ref({
  name: "",
  description: "",
  avatar: "",
  color: "#6366f1",
});

const availableColors = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
];

// Firebase listener
let unsubscribeUsers = null;

// Computed
const canCreateUser = computed(() => {
  return (
    newUser.value.name.trim() &&
    newUser.value.description.trim() &&
    newUser.value.avatar.trim() &&
    newUser.value.color
  );
});

// Functions
const loadSelectedUser = () => {
  const saved = localStorage.getItem("selectedUser");
  if (saved) {
    selectedUser.value = JSON.parse(saved);
    isUserSelected.value = true;
  }
};

const saveSelectedUser = (user) => {
  localStorage.setItem("selectedUser", JSON.stringify(user));
  console.log("User saved:", user);
};

const clearSelection = () => {
  localStorage.removeItem("selectedUser");
  selectedUser.value = null;
  isUserSelected.value = false;
};

const debugFirebaseUsers = () => {
  console.log("🔍 Debug des utilisateurs Firebase");
  console.log("Nombre d'utilisateurs:", users.value.length);

  users.value.forEach((user, index) => {
    console.log(`👤 Utilisateur ${index + 1}:`, {
      name: user.name,
      avatar: user.avatar,
      firebaseId: user.firebaseId,
      id: user.id,
    });

    // Test du chargement de l'avatar
    const img = new Image();
    img.onload = () =>
      console.log(`✅ Avatar OK pour ${user.name}: ${user.avatar}`);
    img.onerror = () =>
      console.error(`❌ Avatar KO pour ${user.name}: ${user.avatar}`);
    img.src = user.avatar;
  });
};

// Modifiez votre fonction loadUsers pour inclure le debug
const loadUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    unsubscribeUsers = firebaseService.listenToUsers((firebaseUsers, err) => {
      if (err) {
        console.error("Erreur Firebase:", err);
        error.value = "Impossible de charger les utilisateurs";
        loading.value = false;
        return;
      }

      users.value = firebaseUsers;
      loading.value = false;

      // 🔍 AJOUTEZ CETTE LIGNE DE DEBUG
      console.log("📊 Utilisateurs chargés depuis Firebase:", firebaseUsers);
      debugFirebaseUsers(); // Appelez la fonction de debug

      if (firebaseUsers.length === 0) {
        migrateDefaultUsers();
      }
    });
  } catch (err) {
    console.error("Erreur chargement utilisateurs:", err);
    error.value = "Erreur de connexion à Firebase";
    loading.value = false;
  }
};

const migrateDefaultUsers = async () => {
  const defaultUsers = [
    {
      id: 1,
      name: "Moon",
      avatar: "/pfp/moon.webp", // Adaptez le chemin selon votre structure
      color: "#6366f1",
      description: "Rêveur de pensées nocturnes",
    },
    {
      id: 2,
      name: "Kouromo",
      avatar: "/pfp/kouromo.webp", // Adaptez le chemin selon votre structure
      color: "#f59e0b",
      description: "Énergie brillante et chaleur",
    },
  ];

  try {
    await firebaseService.migrateLocalUsers(defaultUsers);
    console.log("Utilisateurs par défaut créés");
  } catch (error) {
    console.error("Erreur création utilisateurs par défaut:", error);
  }
};

const createNewUser = async () => {
  if (!canCreateUser.value) return;

  try {
    creatingUser.value = true;

    const userData = {
      ...newUser.value,
      id: Date.now(), // ID temporaire, Firebase créera son propre ID
    };

    await firebaseService.createUser(userData);

    // Reset form
    newUser.value = {
      name: "",
      description: "",
      avatar: "",
      color: "#6366f1",
    };
    showAddUserForm.value = false;

    console.log("Nouvel utilisateur créé avec succès");
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    error.value = "Impossible de créer l'utilisateur";
  } finally {
    creatingUser.value = false;
  }
};

const selectUser = (user) => {
  console.log("Selected user:", user);
  selectingUserId.value = user.firebaseId || user.id;

  saveSelectedUser(user);
  isUserSelected.value = true;

  // Mettre à jour lastActive
  if (user.firebaseId) {
    firebaseService
      .updateUser(user.firebaseId, {
        lastActive: new Date().toISOString(),
      })
      .catch(console.error);
  }

  // Redirection avec délai pour l'animation
  setTimeout(() => {
    console.log("Redirecting to vent...");
    router.push("/vent");
  }, 800);
};

const retryLoading = () => {
  loadUsers();
};

const handleImageError = (event) => {
  const img = event.target;
  const userId = img.alt; // Utilise le nom comme fallback ID
  if (!failedImages.value.includes(userId)) {
    failedImages.value.push(userId);
  }
};

// Generate animated background elements
const generateStars = () => {
  for (let i = 0; i < 50; i++) {
    stars.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    });
  }
};

const generateShapes = () => {
  const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];
  for (let i = 0; i < 8; i++) {
    shapes.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 15,
    });
  }
};

onMounted(async () => {
  generateStars();
  generateShapes();
  loadSelectedUser();
  await loadUsers();

  // Generate dynamic CSS for floating animations
  const style = document.createElement("style");
  let css = "";

  shapes.value.forEach((shape) => {
    css += `
    @keyframes float-${shape.id} {
      0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
      25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
      50% { transform: translateY(-10px) translateX(-15px) rotate(180deg); }
      75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
    }`;
  });

  style.textContent = css;
  document.head.appendChild(style);
});

onUnmounted(() => {
  if (unsubscribeUsers) {
    unsubscribeUsers();
  }
});
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
  content: "✓";
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

.user-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-divider {
  margin: 0 0.25rem;
  color: rgba(255, 255, 255, 0.4);
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
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1),
    rgba(245, 158, 11, 0.1)
  );
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

/* clear button on the right side of the welcome back text */
.clear-button {
  position: absolute;
  top: 3.4rem;
  right: 3rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.clear-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.1);
}

.add-user-section {
  margin-top: 2rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.add-user-toggle {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.add-user-toggle:hover {
  color: #4f46e5;
}

.add-user-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.form-input {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.5rem;
  color: white;
  font-size: 0.875rem;
}

.form-action {
  display: flex;
  justify-content: flex-end;
}

.create-btn {
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
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
