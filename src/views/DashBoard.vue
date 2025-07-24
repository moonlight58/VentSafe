<template>
  <div class="dashboard">
    <!-- Background elements similar to SelectAvatar -->
    <div class="background">
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
      <!-- User header -->
      <div class="user-header">
        <div class="user-info">
          <img
            v-if="currentUser?.avatar"
            :src="currentUser.avatar"
            :alt="currentUser?.name"
            class="user-avatar"
            :style="{ backgroundColor: currentUser?.color + '33' }"
            @error="handleImageError"
          />
          <div
            v-else
            class="user-avatar-placeholder"
            :style="{ backgroundColor: currentUser?.color + '33' }"
          >
            {{ currentUser?.name?.charAt(0) || "?" }}
          </div>
          <div class="user-details">
            <h2 class="user-name">
              {{ currentUser?.name || "Unknown User" }}'s Space
            </h2>
            <p class="user-description">
              {{ currentUser?.description || "No description" }}
            </p>
          </div>
        </div>
        <div class="sync-status">
          <!-- Status synced -->
          <div
            v-if="syncStatus === 'synced'"
            class="status-indicator synced"
            title="Synchronisé"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <!-- Status syncing -->
          <div
            v-if="syncStatus === 'syncing'"
            class="status-indicator syncing"
            title="Synchronisation en cours..."
          >
            <svg
              class="spinner"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            </svg>
          </div>

          <!-- Status error -->
          <div
            v-if="syncStatus === 'error'"
            class="status-indicator error"
            title="Erreur de synchronisation - Cliquer pour réessayer"
            @click="retrySync"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <!-- Status offline -->
          <div
            v-if="syncStatus === 'offline'"
            class="status-indicator offline"
            title="Hors ligne"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <path d="M12 20h.01" />
            </svg>
          </div>

          <span class="status-text">
            <span v-if="syncStatus === 'synced'" class="synced-text"
              >Synchronisé</span
            >
            <span v-if="syncStatus === 'syncing'" class="syncing-text"
              >En cours...</span
            >
            <span v-if="syncStatus === 'error'" class="error-text">Erreur</span>
            <span v-if="syncStatus === 'offline'" class="offline-text"
              >Hors ligne</span
            >
          </span>
        </div>
        <button @click="changeUser" class="change-user-btn" title="Change user">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
      </div>

      <!-- Main content area -->
      <div class="content-area">
        <!-- Create Card Section -->
        <div class="create-section">
          <div class="section-header">
            <h3>Express Yourself</h3>
            <p>What's on your mind?</p>
          </div>

          <div class="card-creator">
            <!-- Mood Selection -->
            <div class="mood-selector">
              <label class="input-label">How are you feeling?</label>
              <div class="mood-options">
                <button
                  v-for="mood in moods"
                  :key="mood.id"
                  @click="selectedMood = mood"
                  class="mood-btn"
                  :class="{ selected: selectedMood?.id === mood.id }"
                >
                  <span class="mood-emoji">{{ mood.emoji }}</span>
                  <span class="mood-name">{{ mood.name }}</span>
                </button>
              </div>
            </div>

            <!-- Text Input -->
            <div class="text-input-section">
              <label class="input-label">Your thoughts</label>
              <textarea
                v-model="cardText"
                placeholder="Share what's on your mind... this is your safe space."
                class="card-textarea"
                :style="{ borderColor: currentUser?.color + '33' }"
                rows="4"
              ></textarea>
              <div
                class="char-count"
                :class="{ 'limit-warning': cardText.length > 280 }"
              >
                {{ cardText.length }}/300
              </div>
            </div>

            <!-- Create Button -->
            <button
              @click="createCard"
              :disabled="!canCreateCard"
              class="create-btn"
              :style="{
                backgroundColor: canCreateCard
                  ? currentUser?.color
                  : 'rgba(255,255,255,0.1)',
                borderColor: currentUser?.color,
              }"
            >
              <span v-if="!isCreating">Create Card</span>
              <span v-else class="creating-text">
                <svg class="spinner" width="16" height="16" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-dasharray="31.416"
                    stroke-dashoffset="31.416"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      dur="2s"
                      values="0 31.416;15.708 15.708;0 31.416"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      dur="2s"
                      values="0;-15.708;-31.416"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                Processing...
              </span>
            </button>
          </div>
        </div>

        <!-- Timeline Section -->
        <div class="timeline-section">
          <div class="section-header">
            <h3>Recent Moments</h3>
            <p>Your emotional journey</p>
          </div>

          <div class="timeline">
            <div v-if="cards.length === 0" class="empty-timeline">
              <div class="empty-icon">✨</div>
              <p>Your first card will appear here</p>
            </div>

            <div
              v-for="card in cards"
              :key="getCardKey(card)"
              class="timeline-card"
              :class="{
                processing: card.isProcessing,
                editing:
                  editingCard?.firebaseId === card.firebaseId ||
                  editingCard?.id === card.id,
              }"
            >
              <!-- Edit Mode -->
              <div
                v-if="
                  !card.isProcessing &&
                  (editingCard?.firebaseId === card.firebaseId ||
                    editingCard?.id === card.id)
                "
                class="edit-mode"
              >
                <div class="edit-header">
                  <h4>Edit your card</h4>
                  <div class="edit-actions">
                    <button
                      @click="saveEdit"
                      class="save-btn"
                      :disabled="!editMood || !editText.trim()"
                    >
                      Save
                    </button>
                    <button @click="cancelEditing" class="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>

                <div class="edit-mood">
                  <label class="edit-label">Mood</label>
                  <div class="edit-mood-options">
                    <button
                      v-for="mood in moods"
                      :key="mood.id"
                      @click="editMood = mood"
                      class="edit-mood-btn"
                      :class="{ selected: editMood?.id === mood.id }"
                    >
                      {{ mood.emoji }}
                    </button>
                  </div>
                </div>

                <div class="edit-text">
                  <label class="edit-label">Text</label>
                  <textarea
                    v-model="editText"
                    class="edit-textarea"
                    rows="3"
                    maxlength="300"
                  ></textarea>
                  <div class="edit-char-count">{{ editText.length }}/300</div>
                </div>
              </div>

              <!-- View Mode -->
              <div v-else>
                <div class="card-header">
                  <img
                    :src="card.user.avatar"
                    :alt="card.user.name"
                    class="card-avatar"
                  />
                  <div class="card-meta">
                    <span class="card-user">{{ card.user.name }}</span>
                    <div class="card-time-container">
                      <span class="card-time">{{
                        formatTime(card.timestamp)
                      }}</span>
                      <span
                        v-if="card.editedAt"
                        class="edited-indicator"
                        :title="`Edited ${formatTime(card.editedAt)}`"
                      >
                        • edited
                      </span>
                    </div>
                  </div>
                  <span class="card-mood">{{ card.mood.emoji }}</span>

                  <!-- Card Actions -->
                  <div v-if="!card.isProcessing" class="card-actions">
                    <button
                      @click="startEditing(card)"
                      class="action-btn edit-btn"
                      title="Edit card"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteCard(card)"
                      class="action-btn delete-btn"
                      title="Delete card"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="3,6 5,6 21,6" />
                        <path
                          d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
                        />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="card-content">
                  <p>{{ card.text }}</p>
                </div>
              </div>

              <div v-if="card.isProcessing" class="processing-overlay">
                <div class="processing-text">Processing...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { firebaseService } from "@/services/firebase.js";

// Export pour le template
export default {
  setup() {
    const router = useRouter();

    // User state
    const currentUser = ref(null);

    // Card creation state
    const selectedMood = ref(null);
    const cardText = ref("");
    const isCreating = ref(false);

    // Timeline state
    const cards = ref([]);
    const editingCard = ref(null);
    const editText = ref("");
    const editMood = ref(null);

    // Background animation elements
    const stars = ref([]);
    const shapes = ref([]);

    // User card sync state
    const isOnline = ref(true);
    const syncStatus = ref("synced"); // 'syncing', 'synced', 'error', 'offline'
    const unsubscribeFirebase = ref(null);

    // Available moods
    const moods = ref([
      {
        id: 1,
        name: "Happy",
        emoji: "😊",
      },
      {
        id: 2,
        name: "Sad",
        emoji: "😢",
      },
      {
        id: 3,
        name: "Anxious",
        emoji: "😰",
      },
      {
        id: 4,
        name: "Excited",
        emoji: "🤩",
      },
      {
        id: 5,
        name: "Peaceful",
        emoji: "😌",
      },
      {
        id: 6,
        name: "Frustrated",
        emoji: "😤",
      },
      {
        id: 7,
        name: "Grateful",
        emoji: "🙏",
      },
      {
        id: 8,
        name: "Confused",
        emoji: "🤔",
      },
    ]);

    // Computed properties
    const canCreateCard = computed(() => {
      return (
        selectedMood.value &&
        cardText.value.trim().length > 0 &&
        cardText.value.length <= 300
      );
    });

    // Helper function for card keys
    const getCardKey = (card) => {
      return card.firebaseId || `local-${card.id}`;
    };

    // Storage functions
    const loadCurrentUser = () => {
      const saved = localStorage.getItem("selectedUser");
      if (saved) {
        const user = JSON.parse(saved);
        console.log("Loaded user from localStorage:", user); // Debug
        return user;
      }
      console.log("No user found in localStorage"); // Debug
      return null;
    };

    const loadCards = () => {
      const saved = localStorage.getItem("ventingCards");
      return saved
        ? JSON.parse(saved).map((card) => ({
            ...card,
            timestamp: new Date(card.timestamp),
            editedAt: card.editedAt ? new Date(card.editedAt) : null,
          }))
        : [];
    };

    const saveCardsLocally = (cardsToSave) => {
      const cardsForStorage = cardsToSave.map((card) => ({
        ...card,
        timestamp: card.timestamp.toISOString(),
        editedAt: card.editedAt ? card.editedAt.toISOString() : null,
      }));
      localStorage.setItem("ventingCards", JSON.stringify(cardsForStorage));
    };

    // Background generation functions
    const generateStars = () => {
      for (let i = 0; i < 30; i++) {
        stars.value.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          delay: Math.random() * 3,
          duration: Math.random() * 3 + 2,
        });
      }
    };

    const generateShapes = () => {
      const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];
      for (let i = 0; i < 5; i++) {
        shapes.value.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 150 + 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 8 + 12,
        });
      }
    };

    const createCard = async () => {
      if (!canCreateCard.value) return;

      // Clear any existing editing state before creating new card
      editingCard.value = null;
      editText.value = "";
      editMood.value = null;

      isCreating.value = true;
      syncStatus.value = "syncing";

      // Generate a more unique temporary ID
      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newCard = {
        id: tempId,
        user: currentUser.value,
        mood: selectedMood.value,
        text: cardText.value.trim(),
        timestamp: new Date(),
        isProcessing: true,
      };

      // Add locally first for fast UX (this is important!)
      cards.value.unshift(newCard);
      saveCardsLocally(cards.value);

      try {
        // Save to Firebase
        const firebaseId = await firebaseService.saveCard(newCard);

        // Update with Firebase ID
        const cardIndex = cards.value.findIndex((card) => card.id === tempId);
        if (cardIndex !== -1) {
          cards.value[cardIndex] = {
            ...cards.value[cardIndex],
            firebaseId: firebaseId,
            isProcessing: false,
          };
          saveCardsLocally(cards.value);
        }

        syncStatus.value = "synced";
        console.log("Card saved to Firebase:", firebaseId);
      } catch (error) {
        console.error("Firebase error, keeping card locally:", error);
        syncStatus.value = "error";

        // Simulate local processing
        setTimeout(() => {
          const cardIndex = cards.value.findIndex((card) => card.id === tempId);
          if (cardIndex !== -1) {
            cards.value[cardIndex] = {
              ...cards.value[cardIndex],
              isProcessing: false,
            };
            saveCardsLocally(cards.value);
          }
        }, 3000);
      }

      // Clean up form
      selectedMood.value = null;
      cardText.value = "";
      isCreating.value = false;
    };

    const changeUser = () => {
      router.push("/");
    };

    const formatTime = (timestamp) => {
      const now = new Date();
      const cardTime = new Date(timestamp);
      const diffInMs = now - cardTime;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays} days ago`;

      // For older dates, show actual date
      const options = {
        month: "short",
        day: "numeric",
      };
      if (cardTime.getFullYear() !== now.getFullYear()) {
        options.year = "numeric";
      }
      return cardTime.toLocaleDateString("en-US", options);
    };

    const startEditing = (card) => {
      if (card.isProcessing) return;

      console.log("Starting to edit card:", card); // Debug
      console.log("Card firebaseId:", card.firebaseId); // Debug
      console.log("Card id:", card.id); // Debug

      // Stocker la référence exacte de la carte
      editingCard.value = card;
      editText.value = card.text;
      editMood.value = card.mood;

      console.log("editingCard.value set to:", editingCard.value); // Debug
    };

    const cancelEditing = () => {
      editingCard.value = null;
      editText.value = "";
      editMood.value = null;
    };

    const saveEdit = async () => {
      if (!editingCard.value || !editMood.value || !editText.value.trim())
        return;

      console.log("Saving edit for card:", editingCard.value); // Debug

      // Utiliser le bon identifiant pour trouver la card
      const cardIndex = cards.value.findIndex((card) => {
        // D'abord essayer par firebaseId si il existe
        if (editingCard.value.firebaseId && card.firebaseId) {
          return card.firebaseId === editingCard.value.firebaseId;
        }
        // Sinon par l'ID temporaire
        if (editingCard.value.id && card.id) {
          return card.id === editingCard.value.id;
        }
        return false;
      });

      console.log("Found card at index:", cardIndex); // Debug
      console.log("Current cards array:", cards.value); // Debug

      if (cardIndex === -1) {
        console.error("Card not found for editing");
        console.error("Looking for:", editingCard.value);
        console.error("In cards:", cards.value);
        return;
      }

      // IMPORTANT: Modifier la carte existante, ne pas en créer une nouvelle
      const existingCard = cards.value[cardIndex];

      // Mettre à jour seulement les champs modifiés
      existingCard.text = editText.value.trim();
      existingCard.mood = editMood.value;
      existingCard.editedAt = new Date();

      console.log("Updated card:", existingCard); // Debug

      // Sauvegarder localement
      saveCardsLocally(cards.value);

      // Mettre à jour sur Firebase si possible
      if (existingCard.firebaseId) {
        try {
          syncStatus.value = "syncing";
          await firebaseService.updateCard(existingCard.firebaseId, {
            text: existingCard.text,
            mood: existingCard.mood,
            editedAt: existingCard.editedAt,
          });
          syncStatus.value = "synced";
          console.log("Firebase update successful"); // Debug
        } catch (error) {
          console.error("Erreur mise à jour Firebase:", error);
          syncStatus.value = "error";
        }
      }

      cancelEditing();
    };

    const cleanupDuplicateCards = () => {
      const cards = loadCards();
      const cleanedCards = [];
      const seenFirebaseIds = new Set();
      const seenTempIds = new Set();

      cards.forEach((card) => {
        // Si la carte a un firebaseId
        if (card.firebaseId) {
          if (!seenFirebaseIds.has(card.firebaseId)) {
            seenFirebaseIds.add(card.firebaseId);
            cleanedCards.push(card);
          } else {
            console.log("Removing duplicate Firebase card:", card);
          }
        }
        // Si c'est une carte temporaire (sans firebaseId)
        else if (card.id) {
          if (!seenTempIds.has(card.id)) {
            seenTempIds.add(card.id);
            cleanedCards.push(card);
          } else {
            console.log("Removing duplicate temp card:", card);
          }
        }
      });

      if (cleanedCards.length !== cards.length) {
        console.log(
          `Cleaned up ${cards.length - cleanedCards.length} duplicate cards`
        );
        saveCardsLocally(cleanedCards);
        return cleanedCards;
      }

      return cards;
    };

    const deleteCard = async (card) => {
      if (!confirm("Es-tu sûr de vouloir supprimer cette card ?")) return;

      console.log("Deleting card:", card); // Debug

      // Utiliser le bon identifiant pour trouver la card
      const cardIndex = cards.value.findIndex((c) => {
        if (card.firebaseId) {
          return c.firebaseId === card.firebaseId;
        }
        return c.id === card.id;
      });

      if (cardIndex === -1) {
        console.error("Card not found for deletion");
        return;
      }

      // Supprimer localement FIRST
      cards.value.splice(cardIndex, 1);
      saveCardsLocally(cards.value); // IMPORTANT: Remettre cette ligne

      // Supprimer sur Firebase si possible
      if (card.firebaseId) {
        try {
          syncStatus.value = "syncing";
          await firebaseService.deleteCard(card.firebaseId);
          syncStatus.value = "synced";
        } catch (error) {
          console.error("Erreur suppression Firebase:", error);
          syncStatus.value = "error";
        }
      }
    };

    const syncWithFirebase = async () => {
      try {
        syncStatus.value = "syncing";

        // Charger les données locales
        const localCards = loadCards();

        // Charger depuis Firebase
        const firebaseCards = await firebaseService.loadCards();

        if (firebaseCards.length === 0 && localCards.length > 0) {
          // Migrer les données locales vers Firebase
          console.log("Migration des données locales vers Firebase...");
          await firebaseService.migrateLocalData(localCards);

          // Recharger depuis Firebase après migration
          const migratedCards = await firebaseService.loadCards();
          cards.value = migratedCards;
        } else {
          // Fusionner les données Firebase avec les données locales non synchronisées
          const mergedCards = mergeCards(firebaseCards, localCards);
          cards.value = mergedCards;
        }

        syncStatus.value = "synced";
      } catch (error) {
        console.error("Erreur de synchronisation:", error);
        syncStatus.value = "error";

        // Fallback sur les données locales
        cards.value = loadCards();
      }
    };

    const mergeCards = (firebaseCards, localCards) => {
      console.log("Merging cards:", { firebaseCards, localCards });

      // Créer une Map des cards Firebase par firebaseId
      const firebaseMap = new Map();
      firebaseCards.forEach((card) => {
        if (card.firebaseId) {
          firebaseMap.set(card.firebaseId, card);
        }
      });

      // Ajouter les cards locales qui n'ont pas d'équivalent Firebase
      const localOnlyCards = localCards.filter((localCard) => {
        // Si la card locale a un firebaseId, vérifier qu'elle n'existe pas déjà
        if (localCard.firebaseId) {
          return !firebaseMap.has(localCard.firebaseId);
        }
        // Si pas de firebaseId, c'est une card locale uniquement
        return true;
      });

      // Combiner et trier par timestamp
      const merged = [...firebaseCards, ...localOnlyCards].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      console.log("Merged result:", merged);
      return merged;
    };

    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
      if (!isOnline.value) {
        syncStatus.value = "offline";
      }
    };

    onMounted(async () => {
      // Charger l'utilisateur actuel
      currentUser.value = loadCurrentUser();
      console.log("Current user loaded:", currentUser.value); // Debug

      if (!currentUser.value) {
        console.log("No current user, redirecting to /"); // Debug
        router.push("/");
        return;
      }

      // Vérifier le type d'avatar (base64 ou chemin de fichier)
      if (currentUser.value.avatar) {
        if (currentUser.value.avatar.startsWith("data:image/")) {
          // C'est déjà une image base64, pas besoin de modification
          console.log("Avatar is base64 data"); // Debug
        } else if (!currentUser.value.avatar.startsWith("/")) {
          // C'est un nom de fichier, ajouter le chemin
          currentUser.value.avatar = `/assets/pfp/${currentUser.value.avatar}`;
          console.log("Updated avatar path:", currentUser.value.avatar); // Debug
        }
      }

      // Synchronisation initiale
      await syncWithFirebase();
      await cleanupDuplicateCards();

      // Écouter les changements en temps réel
      unsubscribeFirebase.value = firebaseService.onCardsChange(
        (firebaseCards, error) => {
          if (error) {
            console.error("Erreur temps réel Firebase:", error);
            syncStatus.value = "error";
            return;
          }

          if (firebaseCards) {
            // Fusionner avec les données locales
            const localCards = loadCards();
            const merged = mergeCards(firebaseCards, localCards);
            cards.value = merged;
            syncStatus.value = "synced";
          }
        }
      );

      // Générer les éléments de fond
      generateStars();
      generateShapes();

      // CSS dynamique pour les animations
      const style = document.createElement("style");
      let css = "";
      shapes.value.forEach((shape) => {
        css += `
          @keyframes float-${shape.id} {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-15px) translateX(8px) rotate(90deg); }
            50% { transform: translateY(-8px) translateX(-12px) rotate(180deg); }
            75% { transform: translateY(-20px) translateX(4px) rotate(270deg); }
          }`;
      });
      style.textContent = css;
      document.head.appendChild(style);

      // Écouter les changements de connexion
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
      updateOnlineStatus();
    });

    onUnmounted(() => {
      if (unsubscribeFirebase.value) {
        unsubscribeFirebase.value();
      }

      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    });

    // Retry pour la synchronisation
    const retrySync = async () => {
      if (!isOnline.value) {
        alert("Pas de connexion internet");
        return;
      }

      await syncWithFirebase();
    };

    // Handle image loading errors
    const handleImageError = (event) => {
      console.error("Image failed to load:", event.target.src);
      event.target.style.display = "none";
    };

    return {
      // State
      currentUser,
      selectedMood,
      cardText,
      isCreating,
      cards,
      editingCard,
      editText,
      editMood,
      stars,
      shapes,
      isOnline,
      syncStatus,
      moods,

      // Computed
      canCreateCard,

      // Methods
      getCardKey,
      createCard,
      changeUser,
      formatTime,
      startEditing,
      cancelEditing,
      saveEdit,
      deleteCard,
      retrySync,
      handleImageError,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard {
  min-height: 100vh;
  background-color: black;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.background {
  position: fixed;
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
  filter: blur(80px);
  opacity: 0.2;
}

.main-container {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-indicator.synced {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-indicator.syncing {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-indicator.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  cursor: pointer;
}

.status-indicator.error:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: scale(1.05);
}

.status-indicator.offline {
  background: rgba(156, 163, 175, 0.2);
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.spinner {
  animation: spin 1s linear infinite;
}

.status-text {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.synced-text {
  color: #22c55e;
}

.syncing-text {
  color: #3b82f6;
}

.error-text {
  color: #ef4444;
}

.offline-text {
  color: #9ca3af;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-name {
  color: white;
  font-weight: 300;
  font-size: 1.25rem;
  margin: 0;
  letter-spacing: 0.02em;
}

.user-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
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

.change-user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.content-area {
  display: grid;
  gap: 2rem;
}

.create-section,
.timeline-section {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: white;
  font-weight: 300;
  font-size: 1.125rem;
  margin: 0 0 0.25rem 0;
  letter-spacing: 0.02em;
}

.section-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin: 0;
}

.card-creator {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.mood-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.mood-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.mood-btn.selected {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: white;
}

.mood-emoji {
  font-size: 1.5rem;
}

.mood-name {
  font-size: 0.75rem;
  font-weight: 500;
}

.text-input-section {
  position: relative;
}

.card-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
}

.card-textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.card-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.char-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.char-count.limit-warning {
  color: #ef4444;
}

.create-btn {
  align-self: flex-start;
  padding: 0.875rem 2rem;
  border: 1px solid;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.create-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.create-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.creating-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-timeline {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.timeline-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.timeline-card.editing {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.card-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-user {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.card-time-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}

.edited-indicator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  font-style: italic;
}

.card-mood {
  font-size: 1.25rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.timeline-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.05);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.edit-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: #6366f1;
}

/* Edit Mode Styles */
.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-header h4 {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #6366f1;
}

.save-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.edit-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.edit-mood-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.edit-mood-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.edit-mood-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.edit-mood-btn.selected {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
}

.edit-text {
  position: relative;
}

.edit-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
}

.edit-textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(99, 102, 241, 0.4);
}

.edit-char-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.card-content p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
}

.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.processing-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }

  .user-header {
    padding: 1rem;
  }

  .create-section,
  .timeline-section {
    padding: 1.5rem;
  }

  .mood-options {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
}
</style>
