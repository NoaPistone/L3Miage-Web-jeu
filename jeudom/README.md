# 🔴 PUISSANCE 4 - Jeu DOM



---

## Présentation du projet
Ce projet est une version revisitée du jeu Puissance 4. Tout en gardant la mécanique de base (aligner 4 pions pour gagner), nous avons ajouté des **capacités spéciales** utilisables une fois par partie. Le jeu se joue à deux joueurs en local.

### Capacités Spéciales
Chaque joueur possède un inventaire de trois bonus uniques :
* **Bombe en Croix :** Fait exploser les pions situés directement en dessous, à gauche et à droite de l'impact.
* **Bombe en Diagonale :** Fait exploser les quatre pions situés dans les diagonales autour du point d'impact.
* **Flash :** Rend le plateau entièrement blanc pendant le tour de l'adversaire, masquant ainsi la position des pions et les couleurs pour perturber sa stratégie.

---

## Difficultés rencontrées et Solutions

* **Gestion de la gravité après explosion**
  * *Problème :* Lorsqu'un pion spécial fait exploser d'autres pions au milieu de la grille, cela crée des des cases vides sous des pions existants, ce qui est physiquement impossible dans un Puissance 4 classique.
  * *Solution :* Nous avons implémenté une fonction `applyGravity()`. Elle parcourt chaque colonne, récupère les pions restants, et les "ré-empile" vers le bas de la grille (`this.board`). Ensuite, la fonction `redraw()` recalcule la position visuelle de chaque pion pour refléter le nouvel état physique.

* **Désynchronisation entre l'animation et la logique (Async/Await)**
  * *Problème :* Si l'explosion se déclenche instantanément, l'utilisateur ne voit pas le pion spécial tomber. L'effet visuel est gâché par la vitesse d'exécution du code.
  * *Solution :* Nous avons utilisé une fonction asynchrone (`async handleMove`) avec un `await new Promise`. Cela permet de mettre le code en pause pendant 650ms, laissant le temps à l'animation CSS de chute de se terminer avant de calculer les dégâts de l'explosion.

* **Unification du système de sélection des bonus**
  * *Problème :* Au début, chaque pouvoir avait sa propre logique de clic, ce qui créait des bugs visuels (plusieurs pouvoirs sélectionnés en même temps ou des icônes qui restaient allumées).
  * *Solution :* Nous avons unifié la logique dans `selectSpecial` et `activateFlash`. Désormais, cliquer sur un pouvoir désactive automatiquement les autres visuellement via un `querySelectorAll('.special-item').forEach(...)` avant d'activer le nouveau, garantissant qu'un seul état spécial est actif à la fois.

* **Le mode "Flash" et le changement de tour**
  * *Problème :* Le bonus "Flash" doit masquer les couleurs pendant le tour de l'adversaire. Il fallait s'assurer que l'effet s'active précisément après avoir joué son coup et qu'il disparaisse dès que l'adversaire a joué.
  * *Solution :* Nous utilisons un booléen `flashActive`. Lorsqu'un joueur active le Flash, la variable passe à `true`, mais l'effet visuel (classe CSS `flash-active`) n'est appliqué qu'au moment du changement de `currentPlayer`. Au début du tour suivant, toute interaction désactive immédiatement l'effet.
