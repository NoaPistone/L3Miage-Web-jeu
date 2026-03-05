# Projet JEU CANVAS 2D  
L3 MIAGE 


## Auteurs  

Biljana Djordjevic   
Noa Pistone   
 

## Description du jeu 
 

Le joueur doit atteindre la sortie tout en collectant un maximum de pièces afin d’augmenter son score. De plus, le jeu est chronométré.  

Le joueur n’est pas obligé d’attraper toutes les pièces pour accéder au niveau suivant.   
Le jeu contient 7 niveaux avec une difficulté progressive :   

*Niveaux 1 et 2* : les obstacles ne font pas perdre de vies. 

*À partir du niveau 3* : si le joueur touche un obstacle, il recommence le niveau. Les pièces collectées réapparaissent et les points gagnés dans ce niveau sont retirés.

*À partir du niveau 4* : certains obstacles deviennent mobiles.   

*À partir du niveau 6* : le joueur doit activer un bouton pour débloquer l’accès à la sortie.   

*Niveau 7* : apparition d’un ennemi qui suit le joueur.   

Chaque niveau apporte de nouveaux défis.   

 


## Fonctionnalités 

***Interface***   

- Menu d’accueil géré par un état   
- Bouton "Démarrer"   
- Bouton "Continuer"   
- Bouton "Rejouer"   
- Écran Game Over   
- Écran Jeu Terminé   
- Écran "Niveau Terminé" entre chaque niveau   

***Gameplay***

- 7 niveaux avec difficulté progressive   
- Système de score   
- Système de vies   
- Système de temps    
- Réinitialisation complète du niveau en cas de collision (à partir du niveau 3) :   
  - Réapparition des pièces   
  - Retrait des points gagnés dans le niveau   
  - Réapparition du bouton pour accéder à la sortie (niveau 6)
 
- Obstacles fixes et obstacles mobiles   
- Système de bouton à activer pour débloquer la sortie (niveau 6)   
- Apparition d’un ennemi suiveur au niveau 7   


***Architecture et technique***

- Animation avec requestAnimationFrame()   
- Gestion complète des états : menu, jeu, transition, niveau terminé, game over, victoire   
- Écouteurs centralisés   
 



## Organisation du projet  
Le projet est organisé en plusieurs dossiers afin de séparer les responsabilités :   
- assets/ : contient les images du jeu (ex : ligne_arrivee.png).  
- css/ : contient le fichier style.css pour le style de la page.   
- js/ : contient toute la logique du jeu :   
          - etats/ : gestion des différents états du jeu (Menu, GameOver, JeuTermine, Transition).   
          - objetsJeu/ : contient les classes représentant les entités du jeu (Joueur, Ennemi, Obstacle, Piece, BtnDebloque, Objet, Sortie).     
          - utils/ : fonctions utilitaires.   
          - game/ : contient le cœur logique et fonctionnel du jeu (collisions, niveaux, écouteurs, jeu).   
          - Main.js : point d’entrée du programme.   
- index.html : charge le script principal et initialise le jeu.   
 

 

## Bonnes pratiques 

- Utilisation de ctx.save() et ctx.restore()   
- Dessin des objets en (0,0) avec ctx.translate()   
- Utilisation de ctx.rotate() pour les rotations du joueur et de l’ennemi   
- Animation avec requestAnimationFrame()   
- Écouteurs centralisés   
- Gestion d’états pour le jeu   
 

 

## Ressources externes  

- Images : ligne_arrive.png (image représentant la sortie)   
 

## Utilisation d’IA  

Nous avons utilisé l’IA pour nous aider à implémenter le chronomètre pour chaque niveau.   

Prompt utilisé :   

"Comment implémenter un chronomètre entre chaque niveau ?"   

  

 

## Réutilisation de code du cours   

Pour la gestion des collisions, nous nous sommes inspirés du code fourni dans les exemples du cours. Le code a été adapté à la structure de notre projet.   

 

## Difficultés rencontrées :    

- Difficulté à faire fonctionner correctement le bouton "Rejouer".   
- Gestion du déplacement des obstacles mobiles (variables manquantes).   
- Gestion de la disparition d’un obstacle à partir du niveau 6.   
- Difficulté dans la gestion des changements d’état ("JEU EN COURS", transitions, etc.)  
- Actuellement, l'ennemi peut traverser les obstacles.  
 

## Solutions trouvées : 

- Déplacement de la fonction handleClick dans le fichier Ecouteur.js afin de centraliser les événements et éviter les appels multiples.   
- Mise en place de variables min et max pour limiter le déplacement des obstacles mobiles dans une zone définie.   
- Création d’un obstacle spécifique (obsSupp) et mise en place d’une boucle permettant sa suppression dynamique.   
- Déplacement de la gestion des changements d’état dans les fichiers du dossier états afin de mieux structurer l’architecture du jeu.   
 

## Ce dont nous sommes fiers : 

- Implémentation d’un bouton à activer pour débloquer la sortie.
- Déplacement dynamique des obstacles. 
- Disparition dynamique d’un obstacle selon le niveau.   
- Déplacement contrôlé de l’ennemi dans une zone restreinte.   
- Gestion propre des états du jeu.   
