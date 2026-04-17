class Node {
    constructor(row, col, g, h, parent) {
        this.row = row;
        this.col = col;
        this.g = g; 
        this.h = h; 
        this.f = g + h; 
        this.parent = parent;
    }
}
 

function heuristic(row, col, targetRow, targetCol) {
    return Math.abs(row - targetRow) + Math.abs(col - targetCol);
}
 
export function aStar(maze, start, end) {
    const rows = maze.length;
    const cols = maze[0].length;
 
    const openList = [];
    const closedList = new Set();
 
    const startNode = new Node(start.row, start.col, 0, heuristic(start.row, start.col, end.row, end.col), null);
    openList.push(startNode);
 
    while (openList.length > 0) {
        
        openList.sort((a, b) => a.f - b.f);
        const current = openList.shift();
 
        const key = `${current.row},${current.col}`;
        if (closedList.has(key)) continue;
        closedList.add(key);
 
       
        if (current.row === end.row && current.col === end.col) {
            const path = [];
            let node = current;
            while (node) {
                path.unshift({ row: node.row, col: node.col });
                node = node.parent;
            }
            return path;
        }
 
        
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
            if (maze[newRow][newCol] === 1) continue; 
            if (closedList.has(`${newRow},${newCol}`)) continue;
 
            const g = current.g + 1;
            const h = heuristic(newRow, newCol, end.row, end.col);
            openList.push(new Node(newRow, newCol, g, h, current));
        }
    }
 
    return []; 
}