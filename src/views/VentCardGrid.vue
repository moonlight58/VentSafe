<template>
  <div class="cards-grid-page">
    <!-- Background elements -->
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
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <button @click="goBack" class="back-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="header-text">
            <h1>All Vent Cards</h1>
            <p>{{ filteredCards.length }} cards found</p>
          </div>
        </div>
        <button
          @click="toggleFilters"
          class="filter-toggle-btn"
          :class="{ active: showFilters }"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
          Filters
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid" :class="{ 'filters-open': showFilters }">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading cards...</p>
        </div>

        <div v-else-if="filteredCards.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No cards found</h3>
          <p v-if="hasActiveFilters">Try adjusting your filters</p>
          <p v-else>No vent cards available yet</p>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="clear-filters-btn"
          >
            Clear all filters
          </button>
        </div>

        <div v-else class="grid-items">
          <div
            v-for="card in filteredCards"
            :key="getCardKey(card)"
            class="card-item"
            :class="{
              'processing-time': isCardInProcessingTime(card),
              'own-card': isCurrentUserCard(card),
            }"
          >
            <!-- Processing Time Indicator -->
            <div v-if="isCardInProcessingTime(card)" class="processing-badge">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {{ getProcessingTimeRemaining(card) }}
            </div>

            <!-- Card Header -->
            <div class="card-header">
              <img
                :src="card.user.avatar"
                :alt="card.user.name"
                class="user-avatar"
                :style="{ backgroundColor: card.user.color + '33' }"
                @error="handleImageError"
              />
              <div class="user-info">
                <span class="user-name">{{ card.user.name }}</span>
                <span class="card-time">{{ formatTime(card.timestamp) }}</span>
                <span v-if="card.editedAt" class="edited-indicator"
                  >• edited</span
                >
              </div>
              <span class="mood-emoji">{{ card.mood.emoji }}</span>
            </div>

            <!-- Card Content -->
            <div class="card-content">
              <p>{{ card.text }}</p>
            </div>

            <!-- Card Stats -->
            <div class="card-stats">
              <span class="mood-name">{{ card.mood.name }}</span>
              <span class="word-count"
                >{{ getWordCount(card.text) }} words</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Filter Bar -->
    <div class="filter-bar" :class="{ show: showFilters }">
      <div class="filter-header">
        <h3>Filters</h3>
        <button @click="toggleFilters" class="close-filters-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="filter-content">
        <!-- Search Filter -->
        <div class="filter-section">
          <label class="filter-label">Search in text</label>
          <div class="search-input-container">
            <svg
              class="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="21 21l-4.35-4.35" />
            </svg>
            <input
              v-model="filters.searchText"
              type="text"
              placeholder="Search in vent cards..."
              class="search-input"
            />
            <button
              v-if="filters.searchText"
              @click="filters.searchText = ''"
              class="clear-search-btn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Users Filter -->
        <div class="filter-section">
          <label class="filter-label">Filter by users</label>
          <div class="filter-options">
            <button
              v-for="user in availableUsers"
              :key="user.id"
              @click="toggleUserFilter(user.id)"
              class="filter-option"
              :class="{ active: filters.users.includes(user.id) }"
            >
              <img
                :src="user.avatar"
                :alt="user.name"
                class="filter-user-avatar"
                :style="{ backgroundColor: user.color + '33' }"
                @error="handleImageError"
              />
              <span>{{ user.name }}</span>
              <span class="user-card-count"
                >({{ getUserCardCount(user.id) }})</span
              >
            </button>
          </div>
        </div>

        <!-- Emotions Filter -->
        <div class="filter-section">
          <label class="filter-label">Filter by emotions</label>
          <div class="filter-options emotions-grid">
            <button
              v-for="mood in availableMoods"
              :key="mood.id"
              @click="toggleMoodFilter(mood.id)"
              class="filter-option mood-option"
              :class="{ active: filters.moods.includes(mood.id) }"
            >
              <span class="mood-emoji">{{ mood.emoji }}</span>
              <span class="mood-name">{{ mood.name }}</span>
              <span class="mood-count">({{ getMoodCardCount(mood.id) }})</span>
            </button>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="filter-section">
          <label class="filter-label">Filter by date</label>
          <div class="date-filter-options">
            <button
              v-for="range in dateRanges"
              :key="range.value"
              @click="setDateRange(range.value)"
              class="date-range-btn"
              :class="{ active: filters.dateRange === range.value }"
            >
              {{ range.label }}
            </button>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="filter-section">
          <label class="filter-label">Sort by</label>
          <div class="sort-options">
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="setSortOption(option.value)"
              class="sort-option"
              :class="{ active: filters.sortBy === option.value }"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Active Filters Summary -->
        <div v-if="hasActiveFilters" class="active-filters">
          <div class="active-filters-header">
            <span>Active filters:</span>
            <button @click="clearAllFilters" class="clear-all-btn">
              Clear all
            </button>
          </div>
          <div class="active-filter-tags">
            <span v-if="filters.searchText" class="filter-tag">
              Search: "{{ filters.searchText }}"
              <button @click="filters.searchText = ''" class="remove-tag">
                ×
              </button>
            </span>
            <span
              v-for="userId in filters.users"
              :key="`user-${userId}`"
              class="filter-tag"
            >
              {{ getUserName(userId) }}
              <button @click="toggleUserFilter(userId)" class="remove-tag">
                ×
              </button>
            </span>
            <span
              v-for="moodId in filters.moods"
              :key="`mood-${moodId}`"
              class="filter-tag"
            >
              {{ getMoodName(moodId) }}
              <button @click="toggleMoodFilter(moodId)" class="remove-tag">
                ×
              </button>
            </span>
            <span v-if="filters.dateRange !== 'all'" class="filter-tag">
              {{ getDateRangeLabel(filters.dateRange) }}
              <button @click="setDateRange('all')" class="remove-tag">×</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar Backdrop -->
    <div
      v-if="showFilters"
      class="filter-backdrop"
      @click="toggleFilters"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { firebaseService } from "@/services/firebase.js";

export default {
  setup() {
    const router = useRouter();

    // State
    const loading = ref(true);
    const cards = ref([]);
    const currentUser = ref(null);
    const showFilters = ref(false);
    const unsubscribeFirebase = ref(null);

    // Background elements
    const stars = ref([]);
    const shapes = ref([]);

    // Filters
    const filters = ref({
      searchText: "",
      users: [],
      moods: [],
      dateRange: "all", // all, today, week, month, year
      sortBy: "newest", // newest, oldest, user, mood
    });

    // Available options for filters
    const availableUsers = ref([]);
    const availableMoods = ref([]);

    // Date range options
    const dateRanges = ref([
      { value: "all", label: "All time" },
      { value: "today", label: "Today" },
      { value: "week", label: "This week" },
      { value: "month", label: "This month" },
      { value: "year", label: "This year" },
    ]);

    // Sort options
    const sortOptions = ref([
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "user", label: "By user" },
      { value: "mood", label: "By emotion" },
    ]);

    // Computed properties
    const hasActiveFilters = computed(() => {
      return (
        filters.value.searchText ||
        filters.value.users.length > 0 ||
        filters.value.moods.length > 0 ||
        filters.value.dateRange !== "all"
      );
    });

    const filteredCards = computed(() => {
      let result = [...cards.value];

      // Filter by search text
      if (filters.value.searchText) {
        const searchLower = filters.value.searchText.toLowerCase();
        result = result.filter(
          (card) =>
            card.text.toLowerCase().includes(searchLower) ||
            card.user.name.toLowerCase().includes(searchLower) ||
            card.mood.name.toLowerCase().includes(searchLower)
        );
      }

      // Filter by users
      if (filters.value.users.length > 0) {
        result = result.filter((card) =>
          filters.value.users.includes(card.user.id)
        );
      }

      // Filter by moods
      if (filters.value.moods.length > 0) {
        result = result.filter((card) =>
          filters.value.moods.includes(card.mood.id)
        );
      }

      // Filter by date range
      if (filters.value.dateRange !== "all") {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        result = result.filter((card) => {
          const cardDate = new Date(card.timestamp);

          switch (filters.value.dateRange) {
            case "today": {
              return cardDate >= today;
            }
            case "week": {
              const weekAgo = new Date(
                today.getTime() - 7 * 24 * 60 * 60 * 1000
              );
              return cardDate >= weekAgo;
            }
            case "month": {
              const monthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
              );
              return cardDate >= monthAgo;
            }
            case "year": {
              const yearAgo = new Date(
                now.getFullYear() - 1,
                now.getMonth(),
                now.getDate()
              );
              return cardDate >= yearAgo;
            }
            default:
              return true;
          }
        });
      }

      // Sort results
      switch (filters.value.sortBy) {
        case "oldest":
          result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          break;
        case "user":
          result.sort((a, b) => a.user.name.localeCompare(b.user.name));
          break;
        case "mood":
          result.sort((a, b) => a.mood.name.localeCompare(b.mood.name));
          break;
        case "newest":
        default:
          result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          break;
      }

      return result;
    });

    // Methods
    const loadCurrentUser = () => {
      const saved = localStorage.getItem("selectedUser");
      return saved ? JSON.parse(saved) : null;
    };

    const goBack = () => {
      router.back();
    };

    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    const getCardKey = (card) => {
      return card.firebaseId || `local-${card.id}`;
    };

    const isCardInProcessingTime = (card) => {
      if (!card.processingUntil) return false;
      const now = new Date();
      const processingUntil = new Date(card.processingUntil);
      return now < processingUntil && card.isVisibleToOthers === false;
    };

    const isCurrentUserCard = (card) => {
      return currentUser.value && card.user.id === currentUser.value.id;
    };

    const getProcessingTimeRemaining = (card) => {
      if (!card.processingUntil) return "";

      const now = new Date();
      const until = new Date(card.processingUntil);
      const diffMs = until - now;

      if (diffMs <= 0) return "";

      const minutes = Math.ceil(diffMs / (1000 * 60));

      if (minutes < 60) {
        return `${minutes}m`;
      } else {
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
      }
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
      if (diffInDays < 7) return `${diffInDays}d ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
      return cardTime.toLocaleDateString();
    };

    const getWordCount = (text) => {
      return text.trim().split(/\s+/).length;
    };

    const handleImageError = (event) => {
      console.log("Image failed to load:", event.target.src);
    };

    // Filter methods
    const toggleUserFilter = (userId) => {
      const index = filters.value.users.indexOf(userId);
      if (index > -1) {
        filters.value.users.splice(index, 1);
      } else {
        filters.value.users.push(userId);
      }
    };

    const toggleMoodFilter = (moodId) => {
      const index = filters.value.moods.indexOf(moodId);
      if (index > -1) {
        filters.value.moods.splice(index, 1);
      } else {
        filters.value.moods.push(moodId);
      }
    };

    const setDateRange = (range) => {
      filters.value.dateRange = range;
    };

    const setSortOption = (option) => {
      filters.value.sortBy = option;
    };

    const clearAllFilters = () => {
      filters.value = {
        searchText: "",
        users: [],
        moods: [],
        dateRange: "all",
        sortBy: "newest",
      };
    };

    const getUserCardCount = (userId) => {
      return cards.value.filter((card) => card.user.id === userId).length;
    };

    const getMoodCardCount = (moodId) => {
      return cards.value.filter((card) => card.mood.id === moodId).length;
    };

    const getUserName = (userId) => {
      const user = availableUsers.value.find((u) => u.id === userId);
      return user ? user.name : "Unknown";
    };

    const getMoodName = (moodId) => {
      const mood = availableMoods.value.find((m) => m.id === moodId);
      return mood ? mood.name : "Unknown";
    };

    const getDateRangeLabel = (range) => {
      const option = dateRanges.value.find((r) => r.value === range);
      return option ? option.label : range;
    };

    // Background generation
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

    const extractUniqueData = (cards) => {
      // Extract unique users
      const usersMap = new Map();
      const moodsMap = new Map();

      cards.forEach((card) => {
        // Add user
        if (!usersMap.has(card.user.id)) {
          usersMap.set(card.user.id, card.user);
        }

        // Add mood
        if (!moodsMap.has(card.mood.id)) {
          moodsMap.set(card.mood.id, card.mood);
        }
      });

      availableUsers.value = Array.from(usersMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      availableMoods.value = Array.from(moodsMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    };

    // Firebase listener
    const setupFirebaseListener = () => {
      try {
        unsubscribeFirebase.value = firebaseService.listenToAllVisibleCards(
          (updatedCards) => {
            cards.value = updatedCards.map((card) => ({
              ...card,
              timestamp: new Date(card.timestamp),
              editedAt: card.editedAt ? new Date(card.editedAt) : null,
              processingUntil: card.processingUntil
                ? new Date(card.processingUntil)
                : null,
            }));

            extractUniqueData(cards.value);
            loading.value = false;
          },
          currentUser.value?.id
        );
      } catch (error) {
        console.error("Error setting up Firebase listener:", error);
        loading.value = false;
      }
    };

    // Lifecycle
    onMounted(() => {
      currentUser.value = loadCurrentUser();

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

      setupFirebaseListener();
    });

    onUnmounted(() => {
      if (unsubscribeFirebase.value) {
        unsubscribeFirebase.value();
      }
    });

    return {
      // State
      loading,
      cards,
      currentUser,
      showFilters,
      stars,
      shapes,
      filters,
      availableUsers,
      availableMoods,
      dateRanges,
      sortOptions,

      // Computed
      hasActiveFilters,
      filteredCards,

      // Methods
      goBack,
      toggleFilters,
      getCardKey,
      isCardInProcessingTime,
      isCurrentUserCard,
      getProcessingTimeRemaining,
      formatTime,
      getWordCount,
      handleImageError,
      toggleUserFilter,
      toggleMoodFilter,
      setDateRange,
      setSortOption,
      clearAllFilters,
      getUserCardCount,
      getMoodCardCount,
      getUserName,
      getMoodName,
      getDateRangeLabel,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.cards-grid-page {
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.main-container {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.page-header {
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

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
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
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.header-text h1 {
  color: white;
  font-weight: 300;
  font-size: 1.5rem;
  margin: 0;
  letter-spacing: 0.02em;
}

.header-text p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.filter-toggle-btn:hover,
.filter-toggle-btn.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: #6366f1;
}

.cards-grid {
  transition: margin-right 0.3s ease;
}

.cards-grid.filters-open {
  margin-right: 320px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: white;
  font-weight: 300;
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
}

.clear-filters-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #6366f1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.clear-filters-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.grid-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  height: fit-content;
}

.card-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-item.processing-time {
  border-left: 3px solid #9333ea;
  background: rgba(147, 51, 234, 0.05);
}

.card-item.own-card {
  border-left: 3px solid #fbbf24;
  background: rgba(251, 191, 36, 0.05);
}

.processing-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: #9333ea;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  display: block;
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

.mood-emoji {
  font-size: 1.5rem;
}

.card-content {
  margin-bottom: 1rem;
}

.card-content p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
  font-size: 0.875rem;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mood-name {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 500;
}

.word-count {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
}

/* Filter Bar Styles */
.filter-bar {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  overflow-y: auto;
}

.filter-bar.show {
  right: 0;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
}

.filter-header h3 {
  color: white;
  font-weight: 300;
  font-size: 1.125rem;
  margin: 0;
}

.close-filters-btn {
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

.close-filters-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.filter-content {
  padding: 1.5rem;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

/* Search Input */
.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  color: white;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(99, 102, 241, 0.4);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
}

/* Filter Options */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.filter-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-option.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: white;
}

.filter-user-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-card-count,
.mood-count {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

/* Emotions Grid */
.emotions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.mood-option {
  flex-direction: column;
  text-align: center;
  padding: 0.75rem 0.5rem;
}

.mood-emoji {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.mood-name {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Date Range Filter */
.date-filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-range-btn {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-align: left;
}

.date-range-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.date-range-btn.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: white;
}

/* Sort Options */
.sort-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sort-option {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-align: left;
}

.sort-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.sort-option.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: white;
}

/* Active Filters */
.active-filters {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.active-filters-header span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
}

.clear-all-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
}

.clear-all-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.active-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #6366f1;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.remove-tag {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  line-height: 1;
}

.remove-tag:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Filter Backdrop */
.filter-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .cards-grid.filters-open {
    margin-right: 0;
  }

  .filter-bar {
    width: 100%;
    right: -100%;
  }

  .main-container {
    padding: 1rem;
  }

  .grid-items {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-content {
    justify-content: center;
  }

  .filter-toggle-btn {
    justify-content: center;
  }

  .grid-items {
    grid-template-columns: 1fr;
  }

  .card-item {
    padding: 1rem;
  }
}
</style>
