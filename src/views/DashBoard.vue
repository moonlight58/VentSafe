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

            <!-- Processing Time Selection -->
            <div class="processing-time-section">
              <label class="input-label"
                >Processing time before others can see this</label
              >
              <div class="time-options">
                <button
                  v-for="timeOption in processingTimeOptions"
                  :key="timeOption.value"
                  @click="selectedProcessingTime = timeOption"
                  class="time-btn"
                  :class="{
                    selected:
                      selectedProcessingTime?.value === timeOption.value,
                  }"
                >
                  <span class="time-icon">{{ timeOption.icon }}</span>
                  <div class="time-info">
                    <span class="time-label">{{ timeOption.label }}</span>
                    <span class="time-description">{{
                      timeOption.description
                    }}</span>
                  </div>
                </button>
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
                processing: isCardProcessing(card),
                editing:
                  editingCard?.firebaseId === card.firebaseId ||
                  editingCard?.id === card.id,
                'processing-time': isCardInProcessingTime(card),
                'own-card-pending': isOwnCardPending(card),
              }"
            >
              <!-- Processing Time Status -->
              <div
                v-if="isCardInProcessingTime(card)"
                class="processing-time-status"
              >
                <div class="processing-time-info">
                  <svg
                    class="processing-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  <span
                    >{{ getProcessingTimeRemaining(card) }} until visible to
                    others</span
                  >
                </div>
                <div class="processing-actions">
                  <button
                    @click="makeVisibleNow(card)"
                    class="make-visible-btn"
                  >
                    Make visible now
                  </button>
                </div>
              </div>

              <!-- Edit Mode -->
              <div
                v-if="
                  !isCardProcessing(card) &&
                  editingCard &&
                  (editingCard?.firebaseId === card.firebaseId ||
                    editingCard?.id === card.id) &&
                  card.user.id === currentUser.id
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
              <div v-else-if="!isCardProcessing(card)">
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

                  <!-- AJOUT: Indicateur de visibilité pour les cartes de l'utilisateur actuel -->
                  <div
                    v-if="isCurrentUserCard(card) && !card.isVisibleToOthers"
                    class="visibility-status"
                  >
                    <span
                      class="private-indicator"
                      title="Visible seulement par vous"
                    >
                      👁️ Privée
                    </span>
                  </div>

                  <!-- Card Actions (existant) -->
                  <div
                    v-if="
                      !isCardProcessing(card) && card.user.id === currentUser.id
                    "
                    class="card-actions"
                  >
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
    const selectedProcessingTime = ref(null);

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

    // Processing time intervals for cleanup
    const processingTimeIntervals = ref(new Map());

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

    // Processing time options
    const processingTimeOptions = ref([
      {
        value: 0,
        label: "Immediate",
        description: "Visible right away",
        icon: "⚡",
      },
      {
        value: 5,
        label: "5 minutes",
        description: "Quick reflection time",
        icon: "⏱️",
      },
      {
        value: 15,
        label: "15 minutes",
        description: "Short processing time",
        icon: "🕐",
      },
      {
        value: 30,
        label: "30 minutes",
        description: "Medium reflection",
        icon: "🕕",
      },
      {
        value: 60,
        label: "1 hour",
        description: "Deep processing time",
        icon: "⏰",
      },
      {
        value: 180,
        label: "3 hours",
        description: "Extended reflection",
        icon: "🕘",
      },
      {
        value: 1440,
        label: "24 hours",
        description: "Full day to process",
        icon: "📅",
      },
    ]);

    // Computed properties
    const canCreateCard = computed(() => {
      return (
        selectedMood.value &&
        cardText.value.trim().length > 0 &&
        cardText.value.length <= 300 &&
        selectedProcessingTime.value !== null
      );
    });

    const resetEditingState = () => {
      editingCard.value = null;
      editText.value = "";
      editMood.value = null;
    };

    // Helper function for card keys
    const getCardKey = (card) => {
      return card.firebaseId || `local-${card.id}`;
    };

    // Check if card belongs to current user but is not visible to others
    const isOwnCardPending = (card) => {
      return (
        card.user.id === currentUser.value.id &&
        !card.isVisibleToOthers &&
        !isCardInProcessingTime(card)
      );
    };

    // Check if card belongs to current user
    const isCurrentUserCard = (card) => {
      return card.user.id === currentUser.value.id;
    };

    // Check if card is in processing phase (creation)
    const isCardProcessing = (card) => {
      return card.isProcessing === true;
    };
    
    // Check if card is in processing time (waiting period)
    const isCardInProcessingTime = (card) => {
      if (!card.processingUntil) return false;
      return new Date() < new Date(card.processingUntil);
    };

    // Get remaining processing time
    const getProcessingTimeRemaining = (card) => {
      if (!card.processingUntil) return "";

      const now = new Date();
      const until = new Date(card.processingUntil);
      const diffMs = until - now;

      if (diffMs <= 0) return "";

      const minutes = Math.ceil(diffMs / (1000 * 60));

      if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
          return `${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
          return `${hours}h ${remainingMinutes}m`;
        }
      }
    };

    // Make card visible immediately
    const makeVisibleNow = async (card) => {
      const cardIndex = cards.value.findIndex(
        (c) =>
          (card.firebaseId && c.firebaseId === card.firebaseId) ||
          (card.id && c.id === card.id)
      );

      if (cardIndex === -1) return;

      // Remove processing time ET rendre visible aux autres
      cards.value[cardIndex].processingUntil = null;
      cards.value[cardIndex].isVisibleToOthers = true; // AJOUT

      // Save locally
      saveCardsLocally(cards.value);

      // Update Firebase if possible
      if (card.firebaseId) {
        try {
          syncStatus.value = "syncing";
          await firebaseService.updateCard(card.firebaseId, {
            processingUntil: null,
            isVisibleToOthers: true, // AJOUT
          });
          syncStatus.value = "synced";
        } catch (error) {
          console.error("Error updating Firebase:", error);
          syncStatus.value = "error";
        }
      }

      // Clear any existing interval for this card
      const intervalKey = card.firebaseId || card.id;
      if (processingTimeIntervals.value.has(intervalKey)) {
        clearInterval(processingTimeIntervals.value.get(intervalKey));
        processingTimeIntervals.value.delete(intervalKey);
      }
    };

    // Setup processing time countdown
    const setupProcessingTimeCountdown = (card) => {
      if (!card.processingUntil) return;

      const intervalKey = card.firebaseId || card.id;

      // Clear existing interval if any
      if (processingTimeIntervals.value.has(intervalKey)) {
        clearInterval(processingTimeIntervals.value.get(intervalKey));
      }

      const interval = setInterval(async () => {
        if (!isCardInProcessingTime(card)) {
          clearInterval(interval);
          processingTimeIntervals.value.delete(intervalKey);

          // AJOUT: Quand le temps est écoulé, rendre la carte visible automatiquement
          const cardIndex = cards.value.findIndex(
            (c) =>
              (card.firebaseId && c.firebaseId === card.firebaseId) ||
              (card.id && c.id === card.id)
          );

          if (cardIndex !== -1) {
            cards.value[cardIndex].isVisibleToOthers = true;
            saveCardsLocally(cards.value);

            // Update Firebase
            if (card.firebaseId) {
              try {
                await firebaseService.updateCard(card.firebaseId, {
                  isVisibleToOthers: true,
                });
              } catch (error) {
                console.error("Error auto-updating card visibility:", error);
              }
            }
          }

          // Force reactivity update
          cards.value = [...cards.value];
        }
      }, 60000); // Check every minute

      processingTimeIntervals.value.set(intervalKey, interval);
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
            processingUntil: card.processingUntil
              ? new Date(card.processingUntil)
              : null,
          }))
        : [];
    };

    const saveCardsLocally = (cardsToSave) => {
      const cardsForStorage = cardsToSave.map((card) => ({
        ...card,
        timestamp: card.timestamp.toISOString(),
        editedAt: card.editedAt ? card.editedAt.toISOString() : null,
        processingUntil: card.processingUntil
          ? card.processingUntil.toISOString()
          : null,
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

      // Calculate processing until time
      const processingUntil =
        selectedProcessingTime.value.value > 0
          ? new Date(
              Date.now() + selectedProcessingTime.value.value * 60 * 1000
            )
          : null;

      const newCard = {
        user: currentUser.value,
        mood: selectedMood.value,
        text: cardText.value.trim(),
        timestamp: new Date(),
        processingUntil: processingUntil,
        processingTimeMinutes: selectedProcessingTime.value.value,
        isProcessing: true,
        // AJOUT: Marquer si la carte est visible pour les autres
        isVisibleToOthers: selectedProcessingTime.value.value === 0, // Immediate = visible
      };

      try {
        // MODIFICATION: Sauvegarder directement sur Firebase SANS ajouter localement d'abord
        const firebaseId = await firebaseService.saveCard(newCard);

        // MODIFICATION: La carte sera ajoutée automatiquement via le listener Firebase
        // donc on n'ajoute rien manuellement à cards.value

        syncStatus.value = "synced";
        console.log("Card saved to Firebase:", firebaseId);
      } catch (error) {
        console.error("Firebase error, creating local card:", error);
        syncStatus.value = "error";

        // SEULEMENT en cas d'erreur Firebase, créer une carte locale
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        const localCard = {
          ...newCard,
          id: tempId,
          isProcessing: false, // Marquer comme non-processing pour l'affichage local
        };

        cards.value.unshift(localCard);
        saveCardsLocally(cards.value);

        // Setup processing time countdown if needed
        if (processingUntil) {
          setupProcessingTimeCountdown(localCard);
        }
      }

      // Clean up form
      selectedMood.value = null;
      cardText.value = "";
      selectedProcessingTime.value = processingTimeOptions.value[2]; // Reset to default
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
      if (diffInDays < 30) return `${diffInDays} days ago`;
      return cardTime.toLocaleDateString();
    };

    // Edit functionality
    const startEditing = (card) => {
      // Ne pas permettre l'édition des cartes en cours de traitement
      if (isCardProcessing(card)) return;

      editingCard.value = card;
      editText.value = card.text;
      editMood.value = card.mood;
    };

    const cancelEditing = () => {
      editingCard.value = null;
      editText.value = "";
      editMood.value = null;
    };

    const saveEdit = async () => {
      if (!editingCard.value || !editMood.value || !editText.value.trim())
        return;

      const cardToEdit = editingCard.value;
      const cardIndex = cards.value.findIndex(
        (c) =>
          (cardToEdit.firebaseId && c.firebaseId === cardToEdit.firebaseId) ||
          (cardToEdit.id && c.id === cardToEdit.id)
      );

      if (cardIndex === -1) return;

      syncStatus.value = "syncing";

      // Mettre à jour localement
      const updatedCard = {
        ...cards.value[cardIndex],
        mood: editMood.value,
        text: editText.value.trim(),
        editedAt: new Date(),
      };

      cards.value[cardIndex] = updatedCard;
      saveCardsLocally(cards.value);

      // Tenter de sauvegarder sur Firebase
      if (cardToEdit.firebaseId) {
        try {
          await firebaseService.updateCard(cardToEdit.firebaseId, {
            mood: editMood.value, // Le service Firebase gère maintenant l'aplatissement
            text: editText.value.trim(),
            editedAt: new Date(),
          });
          syncStatus.value = "synced";
        } catch (error) {
          console.error("Error updating card on Firebase:", error);
          syncStatus.value = "error";
        }
      } else {
        syncStatus.value = "synced";
      }

      // Nettoyer l'état d'édition
      cancelEditing();
    };

    // Delete functionality
    const deleteCard = async (card) => {
      // Confirmation avant suppression
      if (
        !confirm(
          "Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est irréversible."
        )
      ) {
        return;
      }

      syncStatus.value = "syncing";

      // Supprimer localement
      const cardIndex = cards.value.findIndex(
        (c) =>
          (card.firebaseId && c.firebaseId === card.firebaseId) ||
          (card.id && c.id === card.id)
      );

      if (cardIndex !== -1) {
        cards.value.splice(cardIndex, 1);
        saveCardsLocally(cards.value);
      }

      // Nettoyer les intervalles de temps de traitement
      const intervalKey = card.firebaseId || card.id;
      if (processingTimeIntervals.value.has(intervalKey)) {
        clearInterval(processingTimeIntervals.value.get(intervalKey));
        processingTimeIntervals.value.delete(intervalKey);
      }

      // Supprimer de Firebase si elle existe
      if (card.firebaseId) {
        try {
          await firebaseService.deleteCard(card.firebaseId);
          syncStatus.value = "synced";
        } catch (error) {
          console.error("Error deleting card from Firebase:", error);
          syncStatus.value = "error";
        }
      } else {
        syncStatus.value = "synced";
      }

      // Annuler l'édition si on était en train d'éditer cette carte
      if (
        editingCard.value &&
        ((card.firebaseId &&
          editingCard.value.firebaseId === card.firebaseId) ||
          (card.id && editingCard.value.id === card.id))
      ) {
        cancelEditing();
      }
    };

    // Network status monitoring
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
      if (!isOnline.value) {
        syncStatus.value = "offline";
      } else if (syncStatus.value === "offline") {
        syncStatus.value = "synced";
        // Optionnellement, essayer de resynchroniser
        syncPendingCards();
      }
    };

    // Sync pending cards when back online
    const syncPendingCards = async () => {
      const cardsToSync = cards.value.filter(
        (card) => !card.firebaseId && !card.isProcessing
      );

      if (cardsToSync.length === 0) return;

      syncStatus.value = "syncing";

      for (const card of cardsToSync) {
        try {
          const firebaseId = await firebaseService.saveCard(card);

          const cardIndex = cards.value.findIndex((c) => c.id === card.id);
          if (cardIndex !== -1) {
            cards.value[cardIndex] = {
              ...cards.value[cardIndex],
              firebaseId: firebaseId,
            };
          }
        } catch (error) {
          console.error("Error syncing card:", error);
          syncStatus.value = "error";
          return;
        }
      }

      syncStatus.value = "synced";
      saveCardsLocally(cards.value);
    };

    // Retry sync function
    const retrySync = async () => {
      if (!isOnline.value) {
        syncStatus.value = "offline";
        return;
      }

      await syncPendingCards();
    };

    // Firebase real-time listener
    const setupFirebaseListener = () => {
      if (!currentUser.value) return;

      try {
        // MODIFICATION: Passer l'ID de l'utilisateur actuel comme second paramètre
        unsubscribeFirebase.value = firebaseService.listenToAllVisibleCards(
          (updatedCards) => {
            // Reset editing state when cards are updated from Firebase
            resetEditingState();

            // Garder seulement les cartes locales non synchronisées de l'utilisateur actuel
            const localCards = cards.value.filter(
              (card) =>
                !card.firebaseId && card.user.id === currentUser.value.id
            );

            const firebaseCards = updatedCards.map((card) => ({
              ...card,
              timestamp: new Date(card.timestamp),
              editedAt: card.editedAt ? new Date(card.editedAt) : null,
              processingUntil: card.processingUntil
                ? new Date(card.processingUntil)
                : null,
            }));

            // Combiner et trier
            cards.value = [...localCards, ...firebaseCards].sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );

            // Configurer les comptes à rebours pour les cartes de l'utilisateur actuel avec temps de traitement
            cards.value.forEach((card) => {
              if (
                card.user.id === currentUser.value.id &&
                card.processingUntil &&
                isCardInProcessingTime(card)
              ) {
                setupProcessingTimeCountdown(card);
              }
            });

            saveCardsLocally(cards.value);

            if (syncStatus.value !== "offline") {
              syncStatus.value = "synced";
            }
          },
          currentUser.value.id // AJOUT: Passer l'ID de l'utilisateur actuel
        );
      } catch (error) {
        console.error("Error setting up Firebase listener:", error);
        syncStatus.value = "error";
      }
    };

    // Handle image errors
    const handleImageError = (event) => {
      console.log("Image failed to load:", event.target.src);
      // L'image sera remplacée par le placeholder grâce au v-if/v-else
    };

    // Lifecycle hooks
    onMounted(() => {
      // Set default processing time first
      selectedProcessingTime.value = processingTimeOptions.value[4]; // 1 hour default

      // Load user
      const user = loadCurrentUser();
      if (!user) {
        router.push("/");
        return;
      }
      currentUser.value = user;

      // Reset editing state before loading cards
      resetEditingState();

      // Load cards
      cards.value = loadCards();

      // Setup processing time countdowns for existing cards
      cards.value.forEach((card) => {
        if (card.processingUntil && isCardInProcessingTime(card)) {
          setupProcessingTimeCountdown(card);
        }
      });

      // Generate background elements
      generateStars();
      generateShapes();

      // Add dynamic CSS for floating shapes
      const style = document.createElement("style");
      style.textContent = shapes.value
        .map(
          (shape) => `
        @keyframes float-${shape.id} {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(${Math.random() * 20 - 10}px, ${
            Math.random() * 20 - 10
          }px) rotate(90deg); }
          50% { transform: translate(${Math.random() * 30 - 15}px, ${
            Math.random() * 30 - 15
          }px) rotate(180deg); }
          75% { transform: translate(${Math.random() * 20 - 10}px, ${
            Math.random() * 20 - 10
          }px) rotate(270deg); }
        }
      `
        )
        .join("");
      document.head.appendChild(style);

      // Setup network monitoring
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
      updateOnlineStatus();

      // Setup Firebase listener
      setupFirebaseListener();
    });

    onUnmounted(() => {
      // Nettoyer les écouteurs d'événements
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);

      // Nettoyer le listener Firebase
      if (unsubscribeFirebase.value) {
        unsubscribeFirebase.value();
      }

      // Nettoyer tous les intervalles de temps de traitement
      processingTimeIntervals.value.forEach((interval) =>
        clearInterval(interval)
      );
      processingTimeIntervals.value.clear();
    });

    // Return all the reactive data and methods
    return {
      // State
      currentUser,
      selectedMood,
      cardText,
      isCreating,
      selectedProcessingTime,
      cards,
      editingCard,
      editText,
      editMood,
      stars,
      shapes,
      isOnline,
      syncStatus,

      // Data
      moods,
      processingTimeOptions,

      // Computed
      canCreateCard,

      // Methods
      getCardKey,
      isCardProcessing,
      isCardInProcessingTime,
      getProcessingTimeRemaining,
      makeVisibleNow,
      createCard,
      changeUser,
      formatTime,
      startEditing,
      cancelEditing,
      saveEdit,
      deleteCard,
      retrySync,
      handleImageError,
      resetEditingState,
      isOwnCardPending,
      isCurrentUserCard,
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
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.timeline-card.editing {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.05);
}

.timeline-card.own-card-pending {
  border-left: 3px solid #fbbf24;
  background: rgba(251, 191, 36, 0.05);
}

.timeline-card.own-card-pending::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fbbf24, transparent);
}

.timeline-card.own-card-pending {
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%,
  100% {
    border-left-color: #fbbf24;
    box-shadow: 0 0 0 rgba(251, 191, 36, 0);
  }
  50% {
    border-left-color: #f59e0b;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
}

.card-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.card-meta {
  flex: 1;
}

.card-user {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.card-time-container {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.timeline-card.processing-time .private-indicator {
  background: rgba(147, 51, 234, 0.1);
  border-color: rgba(147, 51, 234, 0.3);
  color: #9333ea;
}

.timeline-card.processing-time {
  border-left-color: #9333ea;
  background: rgba(147, 51, 234, 0.05);
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

.visibility-status {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.private-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  font-size: 0.75rem;
  color: #fbbf24;
  font-weight: 500;
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

.time-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.time-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.time-btn.selected {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: white;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.time-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.time-description {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

.processing-time-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
}

.processing-time-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.processing-icon {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  margin-right: 0.25rem;
}

.processing-actions {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.make-visible-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #6366f1;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
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
    margin-top: 4rem;
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

  .card-actions {
    opacity: 1;
  }

  .edit-btn {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.4);
    color: #6366f1;
  }

  .delete-btn {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
  }
}
</style>
