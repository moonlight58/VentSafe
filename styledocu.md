# Guide de Style pour la Page de Tableau de Bord

## Introduction

Ce document décrit le style visuel et les éléments de conception utilisés dans la page de tableau de bord. Il est destiné à aider les agents IA à comprendre et à reproduire le style de manière cohérente et efficace.

## Couleurs

### Palette de Couleurs

| Couleur | Code Hexadécimal | Utilisation            |
| ------- | ---------------- | ---------------------- |
| Noir    | `#000000`        | Arrière-plan principal |
| Blanc   | `#FFFFFF`        | Texte principal        |
| Violet  | `#6366F1`        | Accents et boutons     |
| Orange  | `#F59E0B`        | Arrière-plans flous    |
| Vert    | `#10B981`        | Arrière-plans flous    |
| Rose    | `#EC4899`        | Arrière-plans flous    |
| Indigo  | `#8B5CF6`        | Arrière-plans flous    |
| Gris    | `#9CA3AF`        | Texte secondaire       |

### Exemple de Code

```css
.dashboard {
  background-color: #000000;
  color: #ffffff;
}

.user-header {
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.create-btn {
  background-color: #6366f1;
  color: #ffffff;
}
```

## Typographie

### Polices

| Police                                                              | Utilisation     |
| ------------------------------------------------------------------- | --------------- |
| `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Texte principal |

### Tailles de Police

| Taille     | Utilisation             |
| ---------- | ----------------------- |
| `1.25rem`  | Titres principaux       |
| `1rem`     | Texte principal         |
| `0.875rem` | Texte secondaire        |
| `0.75rem`  | Petits textes et labels |

### Exemple de Code

```css
.user-name {
  font-size: 1.25rem;
  font-weight: 300;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 300;
}

.char-count {
  font-size: 0.75rem;
}
```

## Espacement et Disposition

### Marges et Remplissage

| Propriété | Valeur   | Utilisation                             |
| --------- | -------- | --------------------------------------- |
| `margin`  | `2rem`   | Espacement entre les sections           |
| `padding` | `1.5rem` | Remplissage interne des sections        |
| `gap`     | `1rem`   | Espacement entre les éléments flexibles |

### Exemple de Code

```css
.main-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.content-area {
  display: grid;
  gap: 2rem;
}

.card-creator {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
```

## Effets Visuels

### Ombres et Flous

| Propriété         | Valeur                          | Utilisation            |
| ----------------- | ------------------------------- | ---------------------- |
| `backdrop-filter` | `blur(10px)`                    | Flou de l'arrière-plan |
| `box-shadow`      | `0 4px 12px rgba(0, 0, 0, 0.3)` | Ombre des boutons      |

### Exemple de Code

```css
.user-header {
  backdrop-filter: blur(10px);
}

.create-btn:not(:disabled):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

## Animations

### Animations de Base

| Animation | Description                                              | Exemple de Code                                                                           |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `pulse`   | Animation de pulsation pour les étoiles                  | `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`                     |
| `spin`    | Animation de rotation pour les indicateurs de chargement | `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` |

### Exemple de Code

```css
.star {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.spinner {
  animation: spin 1s linear infinite;
}
```
