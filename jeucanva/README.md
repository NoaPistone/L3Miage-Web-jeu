# 🚀 NEON ESCAPE - Canvas 2D


---

## Présentation du projet
Le but de **Neon Escape** est de traverser différents niveaux en évitant les obstacles et les ennemis. Pour obtenir le meilleur score, vous devez ramasser un maximum de pièces tout en étant le plus rapide possible pour atteindre la sortie.

---

## Difficultés rencontrées et Solutions

* **Dysfonctionnement du bouton "Rejouer" :** Nous avons résolu ce problème en centralisant la gestion des clics dans un fichier `Ecouteur.js` unique, évitant ainsi les conflits d'événements et les appels multiples.
* **Instabilité des obstacles mobiles :** Le mouvement des obstacles manquait de précision. Nous avons implémenté des variables limites (min/max) pour encadrer strictement leur zone de déplacement.
* **Suppression dynamique d'obstacles (Niveau 6) :** Pour gérer la disparition de certains éléments du décor, nous avons créé une classe spécifique `obsSupp` pilotée par une boucle de vérification en temps réel.
* **Architecture des états du jeu :** La gestion des transitions entre les menus et les phases de jeu était complexe. Nous avons réorganisé l'ensemble du projet en isolant chaque état (Menu, Jeu, Game Over) dans des fichiers dédiés pour plus de clarté.

---

## Réutilisation du code du cours
Pour la gestion des **collisions**, nous avons adapté et intégré les algorithmes étudiés en cours. Le code a été restructuré pour s'intégrer parfaitement à notre moteur de jeu et à la gestion des différentes entités comme le joueur, les murs et les pièces.
