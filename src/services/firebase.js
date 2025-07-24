// services/firebase.js
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, push, onValue, off, remove, update } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyC9nS9hxc_ompDKPC7jonVGdScQVJye6lc",
  authDomain: "vent-safe.firebaseapp.com",
  databaseURL: "https://vent-safe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vent-safe",
  storageBucket: "vent-safe.firebasestorage.app",
  messagingSenderId: "224134122817",
  appId: "1:224134122817:web:882af144cc1d6b8221e5c0",
  measurementId: "G-1J7RC6BGT5"
};

class FirebaseService {
  constructor() {
    this.app = initializeApp(firebaseConfig)
    this.db = getDatabase(this.app)
    this.cardsRef = ref(this.db, 'ventingCards')
  }

  // Sauvegarder une nouvelle card
  async saveCard(card) {
    try {
      const newCardRef = push(this.cardsRef)
      const cardData = {
        ...card,
        firebaseId: newCardRef.key,
        timestamp: card.timestamp.toISOString(),
        editedAt: card.editedAt ? card.editedAt.toISOString() : null
      }
      
      await set(newCardRef, cardData)
      return newCardRef.key
    } catch (error) {
      console.error('Erreur sauvegarde Firebase:', error)
      throw error
    }
  }

  // Mettre à jour une card existante
  async updateCard(firebaseId, updates) {
    try {
      const cardRef = ref(this.db, `ventingCards/${firebaseId}`)
      const updateData = {
        ...updates,
        editedAt: new Date().toISOString()
      }
      
      await update(cardRef, updateData)
      return true
    } catch (error) {
      console.error('Erreur mise à jour Firebase:', error)
      throw error
    }
  }

  // Supprimer une card
  async deleteCard(firebaseId) {
    try {
      const cardRef = ref(this.db, `ventingCards/${firebaseId}`)
      await remove(cardRef)
      return true
    } catch (error) {
      console.error('Erreur suppression Firebase:', error)
      throw error
    }
  }

  // Charger toutes les cards
  async loadCards() {
    try {
      const snapshot = await get(this.cardsRef)
      if (snapshot.exists()) {
        const data = snapshot.val()
        return Object.values(data).map(card => ({
          ...card,
          timestamp: new Date(card.timestamp),
          editedAt: card.editedAt ? new Date(card.editedAt) : null
        })).sort((a, b) => b.timestamp - a.timestamp)
      }
      return []
    } catch (error) {
      console.error('Erreur chargement Firebase:', error)
      return []
    }
  }

  // Écouter les changements en temps réel
  onCardsChange(callback) {
    const unsubscribe = onValue(this.cardsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const cards = Object.values(data).map(card => ({
          ...card,
          timestamp: new Date(card.timestamp),
          editedAt: card.editedAt ? new Date(card.editedAt) : null
        })).sort((a, b) => b.timestamp - a.timestamp)
        callback(cards)
      } else {
        callback([])
      }
    }, (error) => {
      console.error('Erreur écoute Firebase:', error)
      callback(null, error)
    })

    return unsubscribe
  }

  // Arrêter l'écoute
  stopListening() {
    off(this.cardsRef)
  }

  // Synchroniser les données locales vers Firebase (migration initiale)
  async migrateLocalData(localCards) {
    try {
      console.log('Migration des données locales vers Firebase...')
      
      for (const card of localCards) {
        if (!card.firebaseId) {
          const firebaseId = await this.saveCard(card)
          console.log(`Card ${card.id} migrée avec ID Firebase: ${firebaseId}`)
        }
      }
      
      console.log('Migration terminée !')
      return true
    } catch (error) {
      console.error('Erreur migration:', error)
      throw error
    }
  }
}

// Exporter une instance unique
export const firebaseService = new FirebaseService()