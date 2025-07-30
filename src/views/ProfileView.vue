<template>
  <div class="app-container">
    <div class="main-container">
      <!-- Navigation Header -->
      <div class="nav-header">
        <button @click="goBack" class="back-btn">
          <span>←</span>
        </button>
        <h1 class="page-title">Mon Profil</h1>
        <button @click="goToUserSelection" class="change-user-btn">
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
        </button>
      </div>

      <!-- User not selected state -->
      <div v-if="!currentUser" class="no-user-state">
        <div class="empty-icon">👤</div>
        <h2 class="empty-title">Aucun utilisateur sélectionné</h2>
        <p class="empty-description">
          Veuillez sélectionner un utilisateur pour voir votre profil
        </p>
        <button @click="goToUserSelection" class="select-user-btn">
          Choisir un utilisateur
        </button>
      </div>

      <!-- Profile Content -->
      <div v-else class="profile-content">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-container">
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="profile-avatar"
                :style="{ backgroundColor: currentUser.color + '33' }"
              />
              <div
                class="avatar-glow"
                :style="{ backgroundColor: currentUser.color }"
              ></div>
              <button
                class="change-avatar-btn"
                @click="changeAvatar"
                title="Changer d'avatar"
              >
                📷
              </button>
            </div>
            <div class="profile-info">
              <h2 class="profile-name">{{ currentUser.name }}</h2>
              <p class="profile-description">{{ currentUser.description }}</p>
              <div
                class="profile-badge"
                :style="{
                  borderColor: currentUser.color,
                  color: currentUser.color,
                }"
              >
                Utilisateur actif
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Stats -->
        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <div class="stat-number">{{ userStats.totalPosts }}</div>
              <div class="stat-label">Publications</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎭</div>
            <div class="stat-info">
              <div class="stat-number">{{ userStats.favoriteEmoji }}</div>
              <div class="stat-label">Humeur favorite</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <div class="stat-number">{{ userStats.joinDate }}</div>
              <div class="stat-label">Membre depuis</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-info">
              <div class="stat-number">{{ userStats.streak }}</div>
              <div class="stat-label">Jours consécutifs</div>
            </div>
          </div>
        </div>

        <!-- Profile Settings -->
        <div class="profile-settings">
          <div class="settings-header">
            <h3 class="settings-title">Paramètres du profil</h3>
            <p class="settings-subtitle">Personnalisez votre expérience</p>
          </div>

          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">Nom d'affichage</div>
                <div class="setting-description">{{ currentUser.name }}</div>
              </div>
              <button class="setting-action" @click="editUsername">
                <span>✏️</span>
              </button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">Description</div>
                <div class="setting-description">
                  {{ currentUser.description }}
                </div>
              </div>
              <button class="setting-action" @click="editDescription">
                <span>✏️</span>
              </button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">Couleur de profil</div>
                <div class="setting-description">
                  Personnalise votre identité visuelle
                </div>
              </div>
              <div class="color-picker-container">
                <div
                  class="color-preview"
                  :style="{ backgroundColor: currentUser.color }"
                  @click="showColorPicker = !showColorPicker"
                ></div>
                <div v-if="showColorPicker" class="color-picker-dropdown">
                  <div class="color-grid">
                    <div
                      v-for="color in predefinedColors"
                      :key="color"
                      class="color-option"
                      :style="{ backgroundColor: color }"
                      @click="changeColor(color)"
                      :class="{ active: currentUser.color === color }"
                    ></div>
                  </div>
                  <input
                    type="color"
                    :value="currentUser.color"
                    @input="changeColor($event.target.value)"
                    class="custom-color-input"
                  />
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">Notifications Discord</div>
                <div class="setting-description">
                  {{
                    notificationsEnabled &&
                    discordUsername.value &&
                    discordWebhookUrl.value
                      ? `Configuré pour @${discordUsername.value}`
                      : notificationsEnabled &&
                        discordUsername.value &&
                        !discordWebhookUrl.value
                      ? "Webhook manquant - Configuration incomplète"
                      : "Recevoir des notifications sur Discord"
                  }}
                </div>
              </div>
              <div class="setting-actions">
                <button
                  v-if="notificationsEnabled"
                  class="setting-action config-btn"
                  @click="openDiscordModal"
                  title="Configurer Discord"
                >
                  ⚙️
                </button>
                <div
                  class="toggle-switch discord-toggle"
                  :class="{ active: notificationsEnabled }"
                  @click="toggleNotifications"
                >
                  <div class="toggle-handle"></div>
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">Mode sombre</div>
                <div class="setting-description">Interface en mode nuit</div>
              </div>
              <div
                class="toggle-switch"
                :class="{ active: darkMode }"
                @click="toggleDarkMode"
              >
                <div class="toggle-handle"></div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">Confidentialité</div>
                <div class="setting-description">Profil privé</div>
              </div>
              <div
                class="toggle-switch"
                :class="{ active: privateProfile }"
                @click="togglePrivateProfile"
              >
                <div class="toggle-handle"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <div class="actions-header">
            <h3 class="actions-title">Actions rapides</h3>
          </div>
          <div class="actions-grid">
            <button class="action-btn" @click="exportData">
              <span class="action-icon">💾</span>
              <span class="action-text">Exporter mes données</span>
            </button>
            <button class="action-btn" @click="shareProfile">
              <span class="action-icon">🔗</span>
              <span class="action-text">Partager le profil</span>
            </button>
            <button class="action-btn" @click="resetStats">
              <span class="action-icon">🔄</span>
              <span class="action-text">Réinitialiser stats</span>
            </button>
            <button class="action-btn danger" @click="deleteProfile">
              <span class="action-icon">🗑️</span>
              <span class="action-text">Supprimer profil</span>
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
          <div class="activity-header">
            <h3 class="activity-title">Activité récente</h3>
            <button class="view-all-btn" @click="viewAllActivity">
              Voir tout
            </button>
          </div>

          <div v-if="recentActivity.length === 0" class="no-activity">
            <div class="no-activity-icon">📋</div>
            <p class="no-activity-text">Aucune activité récente</p>
          </div>

          <div v-else class="activity-list">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-emoji">{{ activity.emoji }}</div>
              <div class="activity-info">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour édition du nom -->
    <div v-if="showUsernameModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier le nom d'affichage</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <input
            v-model="editingUsername"
            type="text"
            placeholder="Nouveau nom..."
            class="modal-input"
            maxlength="20"
            @keyup.enter="saveUsername"
          />
          <div class="char-counter">{{ editingUsername.length }}/20</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModals">Annuler</button>
          <button
            class="btn-primary"
            @click="saveUsername"
            :disabled="!editingUsername.trim()"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour édition de la description -->
    <div v-if="showDescriptionModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier la description</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <textarea
            v-model="editingDescription"
            placeholder="Nouvelle description..."
            class="modal-textarea"
            maxlength="100"
            @keyup.ctrl.enter="saveDescription"
          ></textarea>
          <div class="char-counter">{{ editingDescription.length }}/100</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModals">Annuler</button>
          <button class="btn-primary" @click="saveDescription">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de sélection d'avatar -->
    <div v-if="showAvatarModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content avatar-modal" @click.stop>
        <div class="modal-header">
          <h3>Choisir un avatar</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="avatar-grid">
            <div
              v-for="avatar in availableAvatars"
              :key="avatar"
              class="avatar-option"
              @click="changeUserAvatar(avatar)"
              :class="{ active: currentUser.avatar === avatar }"
            >
              <img :src="avatar" :alt="'Avatar option'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de configuration Discord -->
    <div
      v-if="showDiscordModal"
      class="modal-overlay"
      @click="closeDiscordModal"
    >
      <div class="modal-content discord-modal" @click.stop>
        <div class="modal-header">
          <h3>Configuration Discord</h3>
          <button class="close-btn" @click="closeDiscordModal">×</button>
        </div>
        <div class="modal-body">
          <div class="discord-settings">
            <!-- Section Username Discord -->
            <div class="discord-username">
              <label class="discord-label">
                Nom d'utilisateur Discord
                <span class="optional">(optionnel)</span>
              </label>
              <input
                v-model="discordUsername"
                type="text"
                placeholder="votre_nom_discord#1234"
                class="modal-input discord-input"
                @input="saveDiscordSettings"
              />
              <p class="discord-hint">
                💡 Pour identifier qui reçoit les notifications
              </p>
            </div>

            <!-- Section Webhook URL -->
            <div class="discord-webhook">
              <label class="discord-label">
                URL du Webhook Discord
                <span class="required">*</span>
              </label>
              <textarea
                v-model="discordWebhookUrl"
                placeholder="https://discord.com/api/webhooks/123456789/abcdefghijklmnop..."
                class="modal-textarea webhook-input"
                rows="3"
                @input="saveDiscordSettings"
              ></textarea>

              <div class="webhook-actions">
                <a
                  href="https://support.discord.com/hc/fr/articles/228383668-Intro-aux-Webhooks"
                  target="_blank"
                  class="webhook-help"
                >
                  📚 Comment créer un webhook ?
                </a>
                <button
                  @click="handleTestWebhook"
                  :disabled="isTestingWebhook || !discordWebhookUrl.trim()"
                  class="test-webhook-btn"
                  :class="{ testing: isTestingWebhook }"
                >
                  <span v-if="isTestingWebhook">🔄 Test...</span>
                  <span v-else>🧪 Tester</span>
                </button>
              </div>

              <!-- Résultat du test -->
              <div v-if="webhookTestResult" class="webhook-test-result">
                <div v-if="webhookTestResult.success" class="test-success">
                  <span class="result-icon">✅</span>
                  <span class="result-message">{{
                    webhookTestResult.message
                  }}</span>
                </div>
                <div v-else class="test-error">
                  <span class="result-icon">❌ </span>
                  <span class="result-message">{{
                    webhookTestResult.message ||
                    "Erreur lors du test du webhook, veuillez vérifier l'URL."
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Section Notifications par utilisateur -->
            <div v-if="discordWebhookUrl.trim()" class="users-notifications">
              <h4 class="notifications-title">
                📬 Recevoir des notifications pour :
              </h4>
              <div v-if="allUsers.length === 0" class="no-users">
                <div class="no-users-icon">👥</div>
                <p>Aucun autre utilisateur disponible</p>
              </div>
              <div v-else class="users-list">
                <div
                  v-for="user in allUsers"
                  :key="user.id"
                  class="user-notification-item"
                >
                  <div class="user-info">
                    <img
                      :src="user.avatar"
                      :alt="user.name"
                      class="user-mini-avatar"
                      :style="{ backgroundColor: user.color + '33' }"
                    />
                    <div class="user-details">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-description">{{ user.description }}</div>
                    </div>
                  </div>
                  <div class="user-toggles">
                    <button
                      v-if="discordNotifications[user.id]"
                      class="ping-toggle-btn"
                      :class="{ active: discordPings[user.id] }"
                      @click="toggleUserPing(user.id)"
                      title="Activer les pings pour cet utilisateur (@)"
                    >
                      @
                    </button>
                    <div
                      class="notification-toggle"
                      :class="{ active: discordNotifications[user.id] }"
                      @click="toggleUserNotification(user.id)"
                    >
                      <div class="toggle-handle"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="hasPingsEnabled" class="discord-id-section">
                <label class="discord-label">
                  Votre ID utilisateur Discord
                  <span class="required">*</span>
                </label>
                <input
                  v-model="discordUserId"
                  type="text"
                  placeholder="123456789012345678"
                  class="modal-input discord-input discord-id-input"
                  @input="saveDiscordSettings"
                  required
                />
                <p class="discord-hint">
                  💡 Nécessaire pour recevoir des pings (@mention) sur Discord
                </p>
                <div class="discord-id-help">
                  <p class="help-text">📋 Comment obtenir votre ID Discord :</p>
                  <ol class="help-steps">
                    <li>
                      Activez le mode développeur dans Discord (Paramètres →
                      Avancé → Mode développeur)
                    </li>
                    <li>Faites clic droit sur votre nom d'utilisateur</li>
                    <li>Cliquez sur "Copier l'ID utilisateur"</li>
                    <li>Collez l'ID dans le champ ci-dessus</li>
                  </ol>
                </div>
              </div>
            </div>

            <!-- Guide d'utilisation -->
            <div class="discord-guide">
              <h4 class="guide-title">📋 Guide de configuration :</h4>
              <ol class="guide-steps">
                <li>
                  🔧 Va dans les paramètres de ton serveur/channel Discord
                </li>
                <li>⚙️ Clique sur "Intégrations" puis "Webhooks"</li>
                <li>➕ Crée un nouveau webhook et choisis le channel</li>
                <li>📋 Copie l'URL du webhook et colle-la ci-dessus</li>
                <li>🧪 Teste le webhook pour vérifier qu'il fonctionne</li>
                <li>
                  ✅ Active les notifications pour les personnes qui
                  t'intéressent
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeDiscordModal">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notifications -->
    <div v-if="showToast" class="toast" :class="toastType">
      <span class="toast-icon">{{ toastIcon }}</span>
      <span class="toast-message">{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { firebaseService } from "../services/firebase.js";

const router = useRouter();

// Reactive data
const currentUser = ref(null);
const notificationsEnabled = ref(true);
const darkMode = ref(false);
const privateProfile = ref(false);
const showColorPicker = ref(false);

// Modals
const showUsernameModal = ref(false);
const showDescriptionModal = ref(false);
const showAvatarModal = ref(false);
const editingUsername = ref("");
const editingDescription = ref("");

// Toast
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const toastIcon = ref("✅");

// Discord settings
const showDiscordModal = ref(false);
const discordUsername = ref("");
const discordUserId = ref("");
const discordNotifications = ref({});
const discordPings = ref({});
const allUsers = ref([]);
const discordWebhookUrl = ref("");
const webhookTestResult = ref(null);
const isTestingWebhook = ref(false);
const hasPingsEnabled = computed(() => {
  return Object.values(discordPings.value).some((ping) => ping === true);
});

// Predefined colors
const predefinedColors = ref([
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#ef4444",
  "#3b82f6",
  "#f97316",
  "#84cc16",
  "#06b6d4",
  "#8d4ba6",
  "#be185d",
  "#059669",
  "#7c3aed",
  "#dc2626",
]);

// Available avatars
const availableAvatars = ref([
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Snuggles",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Princess",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Smokey",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oreo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Simba",
]);

// Mock data for demo
const userStats = ref({
  totalPosts: 12,
  favoriteEmoji: "😊",
  joinDate: "Jan 2024",
  streak: 7,
});

const recentActivity = ref([
  {
    id: 1,
    emoji: "📝",
    text: "A publié une nouvelle pensée",
    time: "Il y a 2 heures",
  },
  {
    id: 2,
    emoji: "🎭",
    text: "A changé d'humeur vers joyeux",
    time: "Il y a 1 jour",
  },
  {
    id: 3,
    emoji: "✨",
    text: "A rejoint la communauté",
    time: "Il y a 3 jours",
  },
]);

// Functions
const loadCurrentUser = () => {
  const saved = localStorage.getItem("selectedUser");
  if (saved) {
    currentUser.value = JSON.parse(saved);
    loadUserStats();
  }
};

const loadUserStats = async () => {
  if (currentUser.value && currentUser.value.firebaseId) {
    try {
      const cards = await firebaseService.getUserCards(currentUser.value.id);
      userStats.value.totalPosts = cards.length;

      // Calculer l'emoji favori
      const emojiCount = {};
      cards.forEach((card) => {
        if (card.mood) {
          emojiCount[card.mood] = (emojiCount[card.mood] || 0) + 1;
        }
      });

      const favoriteEmoji = Object.keys(emojiCount).reduce(
        (a, b) => (emojiCount[a] > emojiCount[b] ? a : b),
        "😊"
      );
      userStats.value.favoriteEmoji = favoriteEmoji || "😊";

      // Calculer le streak (simulation)
      userStats.value.streak = Math.floor(Math.random() * 30) + 1;
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  }
};

const saveUserToFirebase = async () => {
  if (currentUser.value && currentUser.value.firebaseId) {
    try {
      await firebaseService.updateUser(
        currentUser.value.firebaseId,
        currentUser.value
      );
      localStorage.setItem("selectedUser", JSON.stringify(currentUser.value));
    } catch (error) {
      console.error("Erreur sauvegarde Firebase:", error);
      showToastMessage("Erreur de sauvegarde", "error", "❌");
    }
  }
};

const showToastMessage = (message, type = "success", icon = "✅") => {
  toastMessage.value = message;
  toastType.value = type;
  toastIcon.value = icon;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const closeModals = () => {
  showUsernameModal.value = false;
  showDescriptionModal.value = false;
  showAvatarModal.value = false;
  showColorPicker.value = false;
};

// Edit functions
const editUsername = () => {
  editingUsername.value = currentUser.value.name;
  showUsernameModal.value = true;
};

const saveUsername = async () => {
  if (
    editingUsername.value.trim() &&
    editingUsername.value !== currentUser.value.name
  ) {
    currentUser.value.name = editingUsername.value.trim();
    await saveUserToFirebase();
    showToastMessage("Nom mis à jour !", "success", "✅");
  }
  closeModals();
};

const editDescription = () => {
  editingDescription.value = currentUser.value.description;
  showDescriptionModal.value = true;
};

const saveDescription = async () => {
  if (editingDescription.value !== currentUser.value.description) {
    currentUser.value.description = editingDescription.value;
    await saveUserToFirebase();
    showToastMessage("Description mise à jour !", "success", "✅");
  }
  closeModals();
};

const changeColor = async (color) => {
  currentUser.value.color = color;
  await saveUserToFirebase();
  showColorPicker.value = false;
  showToastMessage("Couleur changée !", "success", "🎨");
};

const changeAvatar = () => {
  showAvatarModal.value = true;
};

const loadAllUsers = async () => {
  try {
    const users = await firebaseService.getAllUsers();
    allUsers.value = users.filter((user) => user.id !== currentUser.value?.id);
  } catch (error) {
    console.error("Erreur chargement utilisateurs:", error);
  }
};

const saveDiscordSettings = async () => {
  if (currentUser.value && currentUser.value.firebaseId) {
    try {
      const discordSettings = {
        userId: discordUserId.value,
        username: discordUsername.value,
        webhookUrl: discordWebhookUrl.value,
        notifications: discordNotifications.value,
        pings: discordPings.value,
      };

      await firebaseService.updateUserDiscordSettings(
        currentUser.value.firebaseId,
        discordSettings
      );

      localStorage.setItem("discordSettings", JSON.stringify(discordSettings));
      showToastMessage("Paramètres Discord sauvegardés !", "success", "✅");
    } catch (error) {
      console.error("Erreur sauvegarde Discord:", error);
      showToastMessage("Erreur de sauvegarde Discord", "error", "❌");
    }
  }
};

const loadDiscordSettings = async () => {
  if (!currentUser.value?.firebaseId) return;

  try {
    const userData = await firebaseService.getUser(
      currentUser.value.firebaseId
    );
    if (userData?.discordSettings) {
      discordUserId.value = userData.discordSettings.userId || "";
      discordUsername.value = userData.discordSettings.username || "";
      discordWebhookUrl.value = userData.discordSettings.webhookUrl || "";
      discordNotifications.value = userData.discordSettings.notifications || {};
      discordPings.value = userData.discordSettings.pings || {};
    }
  } catch (error) {
    console.error("Erreur chargement paramètres Discord:", error);
  }
};

const handleTestWebhook = async () => {
  if (!discordWebhookUrl.value.trim()) {
    webhookTestResult.value = {
      success: false,
      message: "Veuillez d'abord entrer une URL de webhook.",
    };
    return;
  }

  isTestingWebhook.value = true;
  webhookTestResult.value = null;

  try {
    // Utiliser le service Firebase pour le test (validation incluse)
    const result = await firebaseService.testDiscordWebhook(
      discordWebhookUrl.value.trim()
    );
    webhookTestResult.value = result;

    if (result.success) {
      showToastMessage("Test webhook réussi !", "success", "✅");
    } else {
      showToastMessage("Erreur test webhook", "error", "❌");
    }
  } catch (error) {
    webhookTestResult.value = {
      success: false,
      message: "Erreur lors du test.",
    };
    showToastMessage("Erreur test webhook", "error", "❌");
  } finally {
    isTestingWebhook.value = false;
  }
};

const changeUserAvatar = async (avatar) => {
  currentUser.value.avatar = avatar;
  await saveUserToFirebase();
  closeModals();
  showToastMessage("Avatar changé !", "success", "📷");
};

const openDiscordModal = async () => {
  await loadAllUsers();
  showDiscordModal.value = true;
};

const closeDiscordModal = () => {
  showDiscordModal.value = false;
};

const toggleUserNotification = (userId) => {
  if (discordNotifications.value[userId]) {
    delete discordNotifications.value[userId];
  } else {
    discordNotifications.value[userId] = true;
  }
  saveDiscordSettings();
};

const toggleUserPing = (userId) => {
  if (discordPings.value[userId]) {
    delete discordPings.value[userId];
  } else {
    discordPings.value[userId] = true;
  }
  saveDiscordSettings();
};

// Toggle functions
const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value;
  if (notificationsEnabled.value === false) {
    discordNotifications.value = {};
    discordPings.value = {};
  }
  localStorage.setItem(
    "notificationsEnabled",
    JSON.stringify(notificationsEnabled.value)
  );

  // Si on active les notifications, ouvrir la modal Discord
  if (notificationsEnabled.value) {
    openDiscordModal();
  }

  showToastMessage(
    notificationsEnabled.value
      ? "Notifications activées"
      : "Notifications désactivées",
    "info",
    notificationsEnabled.value ? "🔔" : "🔕"
  );
  saveDiscordSettings();
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem("darkMode", JSON.stringify(darkMode.value));
  showToastMessage(
    darkMode.value ? "Mode sombre activé" : "Mode clair activé",
    "info",
    darkMode.value ? "🌙" : "☀️"
  );
};

const togglePrivateProfile = () => {
  privateProfile.value = !privateProfile.value;
  localStorage.setItem("privateProfile", JSON.stringify(privateProfile.value));
  showToastMessage(
    privateProfile.value ? "Profil privé activé" : "Profil public activé",
    "info",
    privateProfile.value ? "🔒" : "🔓"
  );
};

// Action functions
const exportData = () => {
  const data = {
    user: currentUser.value,
    stats: userStats.value,
    settings: {
      notifications: notificationsEnabled.value,
      darkMode: darkMode.value,
      privateProfile: privateProfile.value,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `profil-${currentUser.value.name}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToastMessage("Données exportées !", "success", "💾");
};

const shareProfile = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Profil de ${currentUser.value.name}`,
        text: `Découvrez le profil de ${currentUser.value.name} sur VentSafe`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Partage annulé");
    }
  } else {
    // Fallback pour copier l'URL
    navigator.clipboard.writeText(window.location.href);
    showToastMessage("Lien copié dans le presse-papier !", "success", "🔗");
  }
};

const resetStats = () => {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser vos statistiques ?")) {
    userStats.value = {
      totalPosts: 0,
      favoriteEmoji: "😊",
      joinDate: new Date().toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      }),
      streak: 0,
    };
    showToastMessage("Statistiques réinitialisées !", "success", "🔄");
  }
};

const deleteProfile = () => {
  if (
    confirm(
      "⚠️ ATTENTION : Cette action est irréversible !\n\nÊtes-vous sûr de vouloir supprimer définitivement votre profil et toutes vos données ?"
    )
  ) {
    if (
      confirm("Dernière confirmation : Supprimer définitivement le profil ?")
    ) {
      // Supprimer de Firebase
      if (currentUser.value.firebaseId) {
        firebaseService.deleteUser(currentUser.value.firebaseId);
      }

      // Nettoyer le localStorage
      localStorage.removeItem("selectedUser");
      localStorage.removeItem("users");

      showToastMessage("Profil supprimé", "error", "🗑️");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }
};

const viewAllActivity = () => {
  showToastMessage("Fonctionnalité en développement", "info", "ℹ️");
};

// Navigation functions
const goBack = () => {
  router.go(-1);
};

const goToUserSelection = () => {
  router.push("/");
};

onMounted(() => {
  loadCurrentUser();

  // Load settings
  const savedNotifications = localStorage.getItem("notificationsEnabled");
  if (savedNotifications) {
    notificationsEnabled.value = JSON.parse(savedNotifications);
  }

  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode) {
    darkMode.value = JSON.parse(savedDarkMode);
  }

  const savedPrivateProfile = localStorage.getItem("privateProfile");
  if (savedPrivateProfile) {
    privateProfile.value = JSON.parse(savedPrivateProfile);
  }

  loadDiscordSettings();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cascadia+Code:ital,wght@0,200..700;1,200..700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.2);
}

/* Webkit scrollbars (Chrome, Safari, Edge) */
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

*::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

*::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

*::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0.3);
}

/* Scrollbar spécifique pour la modal Discord */
.discord-modal {
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.4) rgba(0, 0, 0, 0.2);
}

.discord-modal::-webkit-scrollbar {
  width: 8px;
}

.discord-modal::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  margin: 4px;
}

.discord-modal::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.4);
  border-radius: 4px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.discord-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.6);
  border-color: rgba(99, 102, 241, 0.3);
}

.discord-modal::-webkit-scrollbar-thumb:active {
  background: rgba(99, 102, 241, 0.8);
}

/* Liste des utilisateurs */
.users-list::-webkit-scrollbar {
  width: 6px;
}

.users-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  margin: 4px 0;
}

.users-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Textarea et inputs */
textarea::-webkit-scrollbar,
.discord-input::-webkit-scrollbar,
.webhook-input::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track,
.discord-input::-webkit-scrollbar-track,
.webhook-input::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb,
.discord-input::-webkit-scrollbar-thumb,
.webhook-input::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  transition: all 0.3s ease;
}

textarea::-webkit-scrollbar-thumb:hover,
.discord-input::-webkit-scrollbar-thumb:hover,
.webhook-input::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.35);
}

/* Scrollbar pour la grille de couleurs */
.color-grid::-webkit-scrollbar {
  width: 4px;
}

.color-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.color-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.color-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.app-container {
  min-height: 100vh;
  background-color: black;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.main-container {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.change-user-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.menu-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.back-btn:hover,
.change-user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.page-title {
  color: white;
  font-weight: 300;
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}

.no-user-state {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-title {
  color: white;
  font-weight: 300;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
}

.select-user-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #6366f1;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.select-user-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-header {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-container {
  position: relative;
}

.change-avatar-btn {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: baseline;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(10px);
  z-index: 1;
}

.profile-info {
  flex: 1;
}

.profile-name {
  color: white;
  font-weight: 300;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.profile-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.profile-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 1px solid;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background-color: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.profile-settings,
.recent-activity {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
}

.settings-header,
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.settings-title,
.activity-title {
  color: white;
  font-weight: 300;
  font-size: 1.125rem;
  margin: 0;
}

.settings-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.view-all-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.settings-list,
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.setting-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.setting-info {
  display: flex;
  flex-direction: column;
}

.setting-name {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.setting-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.setting-action {
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
  transition: all 0.3s ease;
}

.setting-action:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.color-picker-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-preview {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.color-picker-dropdown {
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(2px);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  z-index: 1;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-color-input {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
}

.toggle-switch {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: rgba(114, 137, 218, 0.6);
}

.toggle-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-switch.active .toggle-handle {
  transform: translateX(1.5rem);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.activity-emoji {
  font-size: 1.5rem;
}

.activity-info {
  flex: 1;
}

.activity-text {
  color: white;
  font-size: 0.875rem;
}

.activity-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.no-activity {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.4);
}

.no-activity-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.quick-actions {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.actions-title {
  color: white;
  font-weight: 300;
  font-size: 1.125rem;
  margin: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.action-btn.danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-size: 0.875rem;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  z-index: 20;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  margin: 5rem auto;
  position: relative;
}

.avatar-modal {
  max-width: 600px;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
}

.avatar-option {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toast {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 30;
}

.toast-icon {
  font-size: 1.5rem;
}

.toast-message {
  font-size: 0.875rem;
}

.modal-textarea {
  width: 100%;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
}

.char-counter {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  background: rgba(99, 102, 241, 0.6);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
}

.no-activity-text {
  color: rgba(255, 255, 255, 0.4);
  font-size: 1rem;
}

.discord-modal {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(114, 137, 218, 0.1);
  border: 1px solid rgba(114, 137, 218, 0.2);
}

.discord-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.discord-username {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.discord-label {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.discord-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.discord-input:focus {
  outline: none;
  border-color: #5865f2;
  background: rgba(255, 255, 255, 0.15);
}

.discord-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.users-notifications {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notifications-title {
  color: white;
  font-weight: 500;
  font-size: 1rem;
  margin: 0;
}

.no-users {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.no-users-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.users-list::-webkit-scrollbar {
  width: 6px;
}

.users-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.users-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.user-notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-notification-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.user-mini-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.user-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.notification-toggle {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.notification-toggle.active {
  background: rgb(114, 137, 218);
}

.notification-toggle .toggle-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.notification-toggle.active .toggle-handle {
  transform: translateX(1.5rem);
}

.setting-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.config-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.config-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.discord-webhook {
  margin: 20px 0;
}

.webhook-input {
  min-height: 60px;
  resize: vertical;
  font-family: "Cascadia Code", monospace;
  font-size: 12px;
}

.webhook-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.webhook-help {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.webhook-help:hover {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  background: rgb(114, 137, 218, 0.2);
  border: 1px solid rgba(114, 137, 218, 0.4);
  color: rgb(114, 137, 218);
  transition: all 0.2s ease-in-out;
}

.test-webhook-btn {
  color: rgb(114, 137, 218);
  background: rgba(114, 137, 218, 0.2);
  border: 1px solid rgba(114, 137, 218, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.test-webhook-btn:hover:not(:disabled) {
  color: rgb(78, 101, 184);
  background: rgba(78, 101, 184, 0.2);
  border: 1px solid rgba(78, 101, 184, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.test-webhook-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-webhook-btn.testing {
  color: rgb(114, 137, 218);
  background: rgba(114, 137, 218, 0.2);
  border: 1px solid rgba(114, 137, 218, 0.4);
}

.webhook-test-result {
  margin-top: 12px;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
}

.test-success {
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: rgba(87, 242, 135);
  background: rgba(87, 242, 135, 0.2);
  border: 1px solid rgba(87, 242, 135, 0.4);
}

.test-error {
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: rgb(220, 38, 38);
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.4);
}

.result-icon {
  flex-shrink: 0;
}

.result-message {
  line-height: 1.4;
}

.discord-guide {
  margin-top: 24px;
  padding: 16px;
  background-color: rgba(114, 137, 218, 0.253);
  border-radius: 8px;
  border-left: 4px solid rgb(114, 137, 218);
}

.guide-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.guide-steps {
  margin: 0;
  padding-left: 20px;
  color: #bbbbbb;
  font-size: 13px;
  line-height: 1.6;
}

.guide-steps li {
  margin-bottom: 4px;
}

.optional {
  color: #9ca3af;
  font-weight: normal;
  font-size: 12px;
}

.required {
  color: #dc2626;
  font-weight: normal;
  font-size: 12px;
}

.notifications-title {
  margin: 20px 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
}

.user-mini-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-toggles {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-shrink: 0;
}

.ping-toggle-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.ping-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.ping-toggle-btn.active {
  background: rgba(114, 137, 218, 0.3);
  border-color: rgba(114, 137, 218, 0.5);
  color: rgb(114, 137, 218);
}

.ping-toggle-btn.active:hover {
  background: rgba(114, 137, 218, 0.4);
  border-color: rgba(114, 137, 218, 0.6);
  color: rgb(114, 137, 218);
}

.discord-id-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(114, 137, 218, 0.1);
  border: 1px solid rgba(114, 137, 218, 0.3);
  border-radius: 8px;
}

.discord-id-input {
  margin-top: 0.5rem;
  font-family: "Cascadia Code", monospace;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.discord-id-help {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border-left: 3px solid rgba(114, 137, 218, 0.6);
}

.help-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.help-steps {
  margin: 0;
  padding-left: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  line-height: 1.5;
}

.help-steps li {
  margin-bottom: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
    margin-top: 4rem;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1rem;
  }

  .profile-name {
    font-size: 1.5rem;
  }
}
</style>
