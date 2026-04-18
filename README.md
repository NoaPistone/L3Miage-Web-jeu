# Projet Application Web

**Auteurs : Noa Pistone & Biljana Djordjevic — L3 MIAGE**

---

## Présentation du projet
Ce projet consite à créer trois jeux basés avec des méthodes différentes en JavaScript/HTML/CSS.

---

## Pourcentage de travail fourni pour chaque jeu

| Jeu | Noa Pistone | Biljana Djordjevic |
| :--- | :---: | :---: |
| **Jeu DOM** | 75% | 25% |
| **Jeu Babylon.js** | 50% | 50% |
| **Jeu Canvas** | 25% | 75% |

---


## Difficultés Rencontrées



### Jeu Canvas 
* **Gestion des événements :** Centralisation du système de clics dans `Ecouteur.js` pour corriger les dysfonctionnements du bouton "Rejouer" et les conflits d'événements.
* **Stabilité du gameplay :** Mise en place de limites strictes (min/max) pour les obstacles et création d'une classe dédiée à la suppression d'objets en temps réel pour le niveau 6.
* **Architecture :** Réorganisation complète du projet en isolant chaque état (Menu, Jeu, Game Over) pour améliorer la clarté du code.

> **Pour plus de détails :** [README du dossier Canvas](./jeucanva).

---

### Jeu Babylon.js
* **IA et Pathfinding (A star) :** Création d'un "mode dégagement" et d'une surveillance de mouvement pour éviter que l'ennemi ne reste bloqué contre les murs 3D.
* **Moteur de collisions :** Recalibrage manuel des hitbox (joueur vs ennemi) et gestion personnalisée de la distance de contact pour éviter les pertes de vie instantanées.
* **Gestion des Assets :** Chargement asynchrone des modèles `.glb` et utilisation de l'algorithme de Fisher-Yates pour varier l'apparence des monstres de façon aléatoire.

> **Pour plus de détails :** [README du dossier Babylon](./jeubabylon).

---

### Jeu DOM 
* **Physique de la grille :** Développement d'une fonction de gravité spécifique pour "ré-empiler" les pions après une explosion provoquée par un bonus.
* **Synchronisation visuelle :** Utilisation de `Async/Await` pour coordonner les animations CSS de chute avec la logique de calcul des dégâts.
* **Interface Utilisateur :** Unification du système de sélection des pouvoirs pour garantir qu'un seul bonus soit actif à la fois et éviter les bugs visuels.

> **Pour plus de détails :** [README du dossier DOM](./jeudom).


---

## Pourquoi ces jeux ?

* **Jeu Canvas (Neon Escape) :** On a choisi ce jeu parce qu’au départ, on ne connaissait pas beaucoup Canvas. Déplacer un personnage avec des flèches et gérer des obstacles simples nous semblait être la meilleure base pour apprendre.
Petit à petit, on a rajouté de la difficulté : on a fait bouger les obstacles, on a intégré un ennemi et ajouté des boutons pour proposer plus de fonctionnalités. Ça nous a permis de construire le jeu étape par étape et d'utiliser tout ce qu'on apprenait au fur et à mesure.  

* **Jeu Babylon JS (Le Labyrinthe) :** Dans ce jeu, nous avions pour consigne d'intégrer de l'intelligence artificielle. Nous avons choisi le labyrinthe car c'est un environnement parfait pour utiliser l'algorithme A*, qui est l'un des algorithmes de pathfinding les plus connus en IA. Un labyrinthe c'est une grille avec des cases libres et des murs, ce qui correspond à ce que fait A*. On pouvait donc voir en temps réel l'IA prendre des décisions : l'ennemi calcule le chemin le plus court vers le joueur, contourne les obstacles, et s'adapte à chaque déplacement. La structure en niveaux nous a aussi permis d'augmenter la difficulté progressivement en ajoutant des ennemis, sans avoir à repenser tout le gameplay.

* **Jeu DOM (Puissance 4) :** On a choisi le Puissance 4 parce que c'est un jeu stratégique qui permet de manipuler la grille HTML. Nous voulions coder la logique de victoire (les alignements horizontaux, verticaux et diagonaux) tout en gardant une interface claire. On a aussi choisi ce jeu parce qu'il nous laissait assez de place pour imaginer notre mode "Spécial" : le DOM nous a permis d'ajouter facilement des animations CSS et des effets visuels sur les cases pour rendre le jeu plus moderne et dynamique.


