# Change Log pour l'extension GPT_Extention_Stri

Ce fichier documente tous les changements importants apportés à chaque version de l'extension.

---

## [V1.03] - 11 Octobre 2024

### Changements :

- **Gestion des erreurs API** :
  - Ajout de notifications spécifiques en cas de clé API manquante ou invalide.
  - Message d'erreur détaillé pour informer l'utilisateur de l'état de l'appel API.

- **Amélioration du Mode STRI** :
  - Si le mode STRI est activé et qu'aucune sélection n'est faite, le texte de la question et des réponses est récupéré automatiquement dans le code source.

- **Raccourci Clavier pour les Notifications** :
  - Ajout d'un raccourci (`⌘Cmd + ⇧Maj + N` sur macOS ou `Ctrl+Shift+N` sur Windows/Linux) pour activer/désactiver rapidement les notifications.
  - Raccourci des notifications modifiables directement depuis `chrome://extensions/shortcuts`.

- **Optimisation de la Sélection Automatique** :
  - Formatage amélioré du texte détecté pour les questions sur STRI.
  - Réduction des espaces et suppression des sauts de ligne pour une meilleure lisibilité du texte envoyé à ChatGPT.

- **Refactoring du Code** :
  - Nettoyage du code avec des commentaires ajoutés pour améliorer la lisibilité.
  - Simplification de certaines fonctions pour une meilleure maintenabilité.

### Bugs Corrigés :

- Résolution d'un problème de détection incorrecte des réponses dans le mode STRI lorsque le texte contenait des sauts de ligne.
- Correction d'un bug empêchant la sauvegarde correcte des options lorsque le préfixe de question était trop long.
- Amélioration de la gestion de l'affichage des notifications.

---

## [V1.02] - 08 Octobre 2024

### Changements :

- **Réactivation de l'extension** :
  - Résolution du problème de fonctionnement causé par les modifications de l'API OpenAI.
- **Patch de bugs** :
  - Correction de plusieurs bugs détectés pour améliorer la stabilité de l'extension.
- **Mise à jour des modèles** :
  - Ajout des nouveaux modèles d'IA disponibles, notamment `gpt-4-turbo` et `gpt-4o`.
- **Mode Notifications** :
  - Ajout d'une option **On/Off** pour activer ou désactiver les notifications des réponses de ChatGPT.
- **Ajout du Mode STRI** :
  - Introduction d'un mode spécifique pour les quiz sur `stri.net` permettant la sélection automatique des réponses.
  - Ajout d'une option **On/Off** pour activer ou désactiver le mode STRI.
  - Ce mode STRI utilise la première lettre de la réponse (`Ex : C.`) pour cocher automatiquement la bonne option dans les quiz.
  - **Limitation** : Ce mode ne prend pas en compte les réponses multiples.
- **Raccourci clavier** :
  - Ajout d'un raccourci clavier (`Command+I` sur macOS ou `Ctrl+I` sur d'autres systèmes) pour lancer le prompt ChatGPT sans passer par le menu contextuel "Répondre". Cela reste modifiable dans : `chrome://extensions/shortcuts` et cliquer sur l'icône de stylo pour modifier les raccourcis selon vos préférences.

---

## [V1.01] - 21 Septembre 2023

### Changements :

- Migration du modèle de `gpt-3.5-turbo` vers `gpt-3.5-turbo-16k`.
  - Ce nouveau modèle offre les mêmes capacités que le modèle `gpt-3.5-turbo` standard mais avec 4 fois plus de contexte.
- Résolution d'un problème d'export de variable pour le choix du modèle sur certaines machines.
  - Ce correctif permet d'assurer que le choix du modèle sera correctement appliqué sur toutes les configurations de machines.

---

## [V1.00] - 20 Septembre 2023

### Initial Release :

- Lancement de la version initiale de l'extension.