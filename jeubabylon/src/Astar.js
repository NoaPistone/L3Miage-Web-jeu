// Astar.js
// Algorithme A* pour trouver le chemin le plus court dans le labyrinthe
 
class Node {
    constructor(row, col, g, h, parent) {
        this.row = row;
        this.col = col;
        this.g = g; // coût depuis le départ
        this.h = h; // heuristique (distance estimée vers la cible)
        this.f = g + h; // coût total
        this.parent = parent;
    }
}
 
// Heuristique : distance de Manhattan
function heuristic(row, col, targetRow, targetCol) {
    return Math.abs(row - targetRow) + Math.abs(col - targetCol);
}
 
// Retourne le chemin sous forme de tableau de cases [{row, col}, ...]
// maze : grille 2D, 0 = chemin, 1 = mur, 2 = départ, 3 = sortie
// start : {row, col}
// end : {row, col}
export function aStar(maze, start, end) {
    const rows = maze.length;
    const cols = maze[0].length;
 
    const openList = [];
    const closedList = new Set();
 
    const startNode = new Node(start.row, start.col, 0, heuristic(start.row, start.col, end.row, end.col), null);
    openList.push(startNode);
 
    while (openList.length > 0) {
        // On prend le noeud avec le coût f le plus bas
        openList.sort((a, b) => a.f - b.f);
        const current = openList.shift();
 
        const key = `${current.row},${current.col}`;
        if (closedList.has(key)) continue;
        closedList.add(key);
 
        // On a atteint la cible
        if (current.row === end.row && current.col === end.col) {
            const path = [];
            let node = current;
            while (node) {
                path.unshift({ row: node.row, col: node.col });
                node = node.parent;
            }
            return path;
        }
 
        // Les 4 directions : haut, bas, gauche, droite
        const directions = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 }
        ];
 
        for (const { dr, dc } of directions) {
            const newRow = current.row + dr;
            const newCol = current.col + dc;
 
            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
            if (maze[newRow][newCol] === 1) continue; // mur
            if (closedList.has(`${newRow},${newCol}`)) continue;
 
            const g = current.g + 1;
            const h = heuristic(newRow, newCol, end.row, end.col);
            openList.push(new Node(newRow, newCol, g, h, current));
        }
    }
 
    return []; // aucun chemin trouvé
}