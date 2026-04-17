# 🧩Le Labyrinthe - Jeu Babylon.js


---

## Présentation du projet
Le joueur doit s'échapper de 7 labyrinthes en récoltant des items et en évitant des ennemis, le tout en faisant le meilleur score possible. Le joueur dispose d'une barre de vie qui diminue au contact des ennemis. Pour survivre et marquer des points, il peut ramasser divers objets dans le labyrinthe :

* **Cristal** (+50 pts)
* **Pièce** (+10 pts)
* **Carte** (+15 pts) : Affiche une flèche vers la sortie pendant 15 sec.
* **Boost** : Double la vitesse temporairement.
* **Bouteille** (+5 pts) : Restaure 20 PV.
* **Pomme** (+2 pts) : Restaure 10 PV.

La difficulté augmente à chaque niveau avec des labyrinthes plus grands et des ennemis plus nombreux. Les ennemis apparaissent à partir du niveau 4, avec jusqu'à 5 ennemis simultanés au niveau 7.

---

##  Difficultés rencontrées et Solutions

* **L'algorithme A star et l'ennemi bloqué**
  * *Problème :* A* calcule un chemin sur une grille 2D, mais l'ennemi se déplace dans un espace 3D réel. Ce décalage provoque des situations où A* ordonne à l'ennemi d'avancer, mais le moteur de collision l'en empêche à cause d'un mur. L'ennemi reste alors bloqué à "pédaler dans le vide". Recalculer à chaque frame aggrave le problème car il reçoit sans cesse le même ordre impossible.
  * *Solution :* On limite le recalcul à 1 fois toutes les 20 frames pour alléger le jeu. Pour détecter le blocage, on surveille si l'ennemi a bougé de moins de 0.005 unités sur 15 frames consécutives. Si c'est le cas, il passe en "mode dégagement" : sa direction est tournée de 60° pendant 20 frames pour le faire glisser le long du mur et sortir de son blocage. À courte distance du joueur, il abandonne complètement A* et fonce directement vers lui, ce qui rend la poursuite plus naturelle.

* **Les collisions**
  * *Problème :* Babylon.js entoure chaque personnage d'une hitbox invisible en forme d'ovale pour détecter les collisions, plutôt que d'utiliser le vrai modèle 3D. Avec les réglages par défaut, ces hitbox étaient mal calibrées : celle du joueur était trop petite (la caméra traversait les murs), celle de l'ennemi trop grande (il restait coincé loin des parois). Le contact entre joueur et ennemi n'était pas non plus géré nativement par le moteur.
  * *Solution :* On a ajusté les hitbox manuellement : large pour le joueur (0.45) pour que la caméra reste toujours derrière les murs, très fine pour l'ennemi (0.2) pour qu'il se faufile dans les couloirs étroits. Le contact joueur/ennemi est géré à la main dans le code : à chaque frame on calcule la distance entre les deux, et si elle est trop faible on pousse l'ennemi en arrière (80%) et le joueur légèrement (20%). Un délai d'1 seconde est imposé entre chaque perte de vie pour éviter que la barre de vie ne se vide instantanément.

* **La caméra à la première personne**
  * *Problème :* La caméra était collée à la tête du personnage mais elle "laguait" derrière les animations et passait parfois à travers les murs.
  * *Solution :* On force le recalcul de la position de la tête à chaque frame. La caméra se décale légèrement vers l'avant avec une transition douce entre marche et course. Le `minZ` de la caméra est réglé à 0.01 pour éviter que les murs disparaissent quand on s'en approche.

* **Les modèles d'ennemis variés**
  * *Problème :* Avec plusieurs ennemis par niveau, ils avaient tous la même apparence. C'est répétitif visuellement et ça casse l'immersion, surtout aux niveaux 6 et 7 où il peut y avoir jusqu'à 4 ou 5 ennemis en même temps.
  * *Solution :* On dispose de 4 modèles de monstres différents (monstre1.glb à monstre4.glb). Avant chaque niveau, on mélange cette liste avec l'algorithme de Fisher-Yates : on parcourt la liste à l'envers et on échange chaque élément avec un autre pris au hasard. Résultat : l'ordre des modèles est différent à chaque partie, donc les ennemis n'ont jamais la même tête dans le même ordre. Si un niveau a plus de 4 ennemis, on repart du début de la liste mélangée. On vérifie aussi avant chaque spawn que la case choisie n'est pas un mur, pour éviter qu'un ennemi apparaisse dans une zone inaccessible.

* **Importation des modèles 3D et des animations**
  * *Problème :* L'importation de fichiers externes (.glb) est asynchrone, ce qui peut causer des erreurs si le code tente d'accéder aux modèles avant qu'ils ne soient chargés. De plus, les animations (marche, course, attaque) possèdent des noms et des structures différentes selon le modèle utilisé.
  * *Solution :* Nous avons utilisé le `SceneLoader` de Babylon.js pour garantir un chargement propre. Pour les animations, nous avons créé un système de gestion qui identifie les groupes d'animations (AnimationGroups) dès l'importation, nous permettant de déclencher la marche ou l'attaque dynamiquement en fonction de l'état de l'ennemi ou des touches pressées par le joueur.
