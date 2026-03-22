export class ScoreManager {
    constructor() {
        this.score = 0;
    }
 
    addPoints(type) {
        switch(type) {
            case "cristal":
                this.score += 50;
                console.log("💎 +50 points ! Score :", this.score);
                break;
            case "piece":
                this.score += 10;
                console.log("🪙 +10 points ! Score :", this.score);
                break;
            case "carte":
                this.score += 15;
                console.log("🗺️ +15 points ! Score :", this.score);
                break;
            case "boost":
                this.score += 0;
                console.log("⚡ Boost activé !");
                break;
            case "bottle":
                this.score += 5;
                console.log("🍶 +5 points ! Score :", this.score);
                break;
            case "apple":
                this.score += 2;
                console.log("🍎 +2 points ! Score :", this.score);
                break;
            default:
                console.warn("⚠️ Type d'item inconnu :", type);
        }
    }
 
    getScore() {
        return this.score;
    }
 
    reset() {
        this.score = 0;
    }
}