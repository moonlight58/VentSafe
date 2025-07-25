// services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onValue,
  off,
  remove,
  update,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC9nS9hxc_ompDKPC7jonVGdScQVJye6lc",
  authDomain: "vent-safe.firebaseapp.com",
  databaseURL:
    "https://vent-safe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vent-safe",
  storageBucket: "vent-safe.firebasestorage.app",
  messagingSenderId: "224134122817",
  appId: "1:224134122817:web:882af144cc1d6b8221e5c0",
  measurementId: "G-1J7RC6BGT5",
};

class FirebaseService {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
    this.cardsRef = ref(this.db, "ventingCards");
    this.usersRef = ref(this.db, "users");
  }

  // ==================== GESTION DES UTILISATEURS ====================

  // Récupérer tous les utilisateurs
  async getUsers() {
    try {
      const snapshot = await get(this.usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data).map((user) => ({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          lastActive: user.lastActive ? new Date(user.lastActive) : new Date(),
        }));
      }
      return [];
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
      return [];
    }
  }

  // Écouter les changements d'utilisateurs en temps réel
  listenToUsers(callback) {
    const unsubscribe = onValue(
      this.usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const users = Object.values(data).map((user) => ({
            ...user,
            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
            lastActive: user.lastActive
              ? new Date(user.lastActive)
              : new Date(),
          }));
          callback(users);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error("Erreur écoute utilisateurs Firebase:", error);
        callback([], error);
      }
    );
    return unsubscribe;
  }

  // Créer un nouvel utilisateur
  async createUser(userData) {
    try {
      const newUserRef = push(this.usersRef);
      const userWithMeta = {
        ...userData,
        firebaseId: newUserRef.key,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        // Statistiques par défaut
        stats: {
          totalPosts: 0,
          favoriteEmoji: "😊",
          joinDate: new Date().toLocaleDateString("fr-FR", {
            month: "short",
            year: "numeric",
          }),
        },
      };

      await set(newUserRef, userWithMeta);
      return { ...userWithMeta, id: newUserRef.key };
    } catch (error) {
      console.error("Erreur création utilisateur:", error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(firebaseId, updates) {
    try {
      const userRef = ref(this.db, `users/${firebaseId}`);
      const updateData = {
        ...updates,
        lastActive: new Date().toISOString(),
      };

      await update(userRef, updateData);
      return true;
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(firebaseId) {
    try {
      const userRef = ref(this.db, `users/${firebaseId}`);
      await remove(userRef);
      return true;
    } catch (error) {
      console.error("Erreur suppression utilisateur:", error);
      throw error;
    }
  }

  // Récupérer un utilisateur spécifique
  async getUser(firebaseId) {
    try {
      const userRef = ref(this.db, `users/${firebaseId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const user = snapshot.val();
        return {
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          lastActive: user.lastActive ? new Date(user.lastActive) : new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error("Erreur récupération utilisateur:", error);
      return null;
    }
  }

  // Mettre à jour les statistiques d'un utilisateur
  async updateUserStats(firebaseId, newStats) {
    try {
      const userRef = ref(this.db, `users/${firebaseId}/stats`);
      await update(userRef, newStats);
      return true;
    } catch (error) {
      console.error("Erreur mise à jour stats utilisateur:", error);
      throw error;
    }
  }

  // Migrer les utilisateurs existants du localStorage vers Firebase
  async migrateLocalUsers(localUsers) {
    try {
      console.log("Migration des utilisateurs locaux vers Firebase...");

      for (const user of localUsers) {
        if (!user.firebaseId) {
          const migratedUser = await this.createUser(user);
          console.log(
            `Utilisateur ${user.name} migré avec ID Firebase: ${migratedUser.firebaseId}`
          );
        }
      }

      console.log("Migration des utilisateurs terminée !");
      return true;
    } catch (error) {
      console.error("Erreur migration utilisateurs:", error);
      throw error;
    }
  }

  // ==================== GESTION DES CARDS ====================

  // CORRECTION: Écouter toutes les cartes visibles (pas seulement celles d'un utilisateur)
  listenToAllVisibleCards(callback) {
    try {
      const unsubscribe = onValue(
        this.cardsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const cards = Object.keys(data)
              .map((key) => ({
                firebaseId: key,
                ...data[key],
                // Reconstituer l'objet user et mood depuis les données aplaties
                user: {
                  id: data[key].userId,
                  name: data[key].userName,
                  avatar: data[key].userAvatar,
                  color: data[key].userColor,
                },
                mood: {
                  id: data[key].moodId,
                  name: data[key].moodName,
                  emoji: data[key].moodEmoji,
                },
              }))
              // CORRECTION: Filtrer seulement les cartes visibles
              .filter((card) => card.isVisibleToOthers === true)
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            callback(cards);
          } else {
            callback([]);
          }
        },
        (error) => {
          console.error("Erreur écoute cartes Firebase:", error);
          callback([], error);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up listener:", error);
      throw error;
    }
  }

  // CORRECTION: Garder aussi l'ancienne méthode pour la compatibilité
  listenToUserCards(userId, callback) {
    return this.listenToAllVisibleCards(callback);
  }

  // Récupérer les cartes d'un utilisateur (méthode ponctuelle)
  async getUserCards(userId) {
    try {
      const snapshot = await get(this.cardsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Filtrer les cartes pour cet utilisateur seulement
        return Object.values(data)
          .filter((card) => card.userId === userId)
          .map((card) => ({
            ...card,
            user: {
              id: card.userId,
              name: card.userName,
              avatar: card.userAvatar,
              color: card.userColor,
            },
            mood: {
              id: card.moodId,
              name: card.moodName,
              emoji: card.moodEmoji,
            },
            timestamp: new Date(card.timestamp),
            editedAt: card.editedAt ? new Date(card.editedAt) : null,
            processingUntil: card.processingUntil
              ? new Date(card.processingUntil)
              : null,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
      }
      return [];
    } catch (error) {
      console.error("Erreur récupération cartes utilisateur:", error);
      return [];
    }
  }

  // CORRECTION: Sauvegarder sur Realtime Database (pas Firestore)
  async saveCard(card) {
    try {
      const newCardRef = push(this.cardsRef);
      const cardData = {
        userId: card.user.id,
        userName: card.user.name,
        userAvatar: card.user.avatar,
        userColor: card.user.color,
        moodId: card.mood.id,
        moodName: card.mood.name,
        moodEmoji: card.mood.emoji,
        text: card.text,
        timestamp: card.timestamp.toISOString(),
        processingUntil: card.processingUntil
          ? card.processingUntil.toISOString()
          : null,
        processingTimeMinutes: card.processingTimeMinutes || 0,
        // AJOUT: Champ pour la visibilité
        isVisibleToOthers: card.isVisibleToOthers || false,
        createdAt: new Date().toISOString(),
      };

      await set(newCardRef, cardData);
      return newCardRef.key;
    } catch (error) {
      console.error("Error saving card:", error);
      throw error;
    }
  }

  // Mettre à jour une card existante
  async updateCard(firebaseId, updates) {
    try {
      const cardRef = ref(this.db, `ventingCards/${firebaseId}`);
      const updateData = {
        ...updates,
      };

      // Convertir les dates en ISO string si présentes
      if (updateData.editedAt && updateData.editedAt instanceof Date) {
        updateData.editedAt = updateData.editedAt.toISOString();
      }
      if (
        updateData.processingUntil &&
        updateData.processingUntil instanceof Date
      ) {
        updateData.processingUntil = updateData.processingUntil.toISOString();
      }
      if (updateData.processingUntil === null) {
        updateData.processingUntil = null;
      }

      // CORRECTION: Gérer la mise à jour du mood s'il est fourni
      if (updateData.mood) {
        updateData.moodId = updateData.mood.id;
        updateData.moodName = updateData.mood.name;
        updateData.moodEmoji = updateData.mood.emoji;
        delete updateData.mood; // Supprimer l'objet mood original
      }

      await update(cardRef, updateData);
      return true;
    } catch (error) {
      console.error("Erreur mise à jour Firebase:", error);
      throw error;
    }
  }

  // Supprimer une card
  async deleteCard(firebaseId) {
    try {
      const cardRef = ref(this.db, `ventingCards/${firebaseId}`);
      await remove(cardRef);
      return true;
    } catch (error) {
      console.error("Erreur suppression Firebase:", error);
      throw error;
    }
  }

  // Charger toutes les cards (méthode existante conservée)
  async loadCards() {
    try {
      const snapshot = await get(this.cardsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map((key) => ({
            firebaseId: key,
            ...data[key],
            user: {
              id: data[key].userId,
              name: data[key].userName,
              avatar: data[key].userAvatar,
              color: data[key].userColor,
            },
            mood: {
              id: data[key].moodId,
              name: data[key].moodName,
              emoji: data[key].moodEmoji,
            },
            timestamp: new Date(data[key].timestamp),
            editedAt: data[key].editedAt ? new Date(data[key].editedAt) : null,
            processingUntil: data[key].processingUntil
              ? new Date(data[key].processingUntil)
              : null,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
      }
      return [];
    } catch (error) {
      console.error("Erreur chargement Firebase:", error);
      return [];
    }
  }

  // Écouter les changements en temps réel (méthode existante conservée)
  onCardsChange(callback) {
    const unsubscribe = onValue(
      this.cardsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const cards = Object.keys(data)
            .map((key) => ({
              firebaseId: key,
              ...data[key],
              user: {
                id: data[key].userId,
                name: data[key].userName,
                avatar: data[key].userAvatar,
                color: data[key].userColor,
              },
              mood: {
                id: data[key].moodId,
                name: data[key].moodName,
                emoji: data[key].moodEmoji,
              },
              timestamp: new Date(data[key].timestamp),
              editedAt: data[key].editedAt ? new Date(data[key].editedAt) : null,
              processingUntil: data[key].processingUntil
                ? new Date(data[key].processingUntil)
                : null,
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          callback(cards);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error("Erreur écoute Firebase:", error);
        callback(null, error);
      }
    );

    return unsubscribe;
  }

  // Arrêter l'écoute
  stopListening() {
    off(this.cardsRef);
  }

  // Synchroniser les données locales vers Firebase (migration initiale)
  async migrateLocalData(localCards) {
    try {
      console.log("Migration des données locales vers Firebase...");

      for (const card of localCards) {
        if (!card.firebaseId) {
          const firebaseId = await this.saveCard(card);
          console.log(`Card ${card.id} migrée avec ID Firebase: ${firebaseId}`);
        }
      }

      console.log("Migration terminée !");
      return true;
    } catch (error) {
      console.error("Erreur migration:", error);
      throw error;
    }
  }
}

// Exporter une instance unique
export const firebaseService = new FirebaseService();