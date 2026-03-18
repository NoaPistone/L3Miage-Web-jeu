import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3, FollowCamera } from "@babylonjs/core";
import { Joueur } from "./joueur";
import { addSkybox, setupLightingAndFog,addGround } from "./scene";
import { GameManager } from "./gameManager";



const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

const createScene = () => {
    const scene = new Scene(engine);
    scene.collisionsEnabled = true;

    // Caméra de côté pour bien voir le mouvement
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    
    // On crée l'instance du joueur
    const monJoueur = new Joueur(scene);

        // On crée le GameManager qui gère les labyrinthes et la logique de progression
    const game = new GameManager(scene, monJoueur);

    return { scene, monJoueur, game };
};



const { scene, monJoueur, game } = createScene();
addSkybox(scene);
addGround(scene);
setupLightingAndFog(scene);



engine.runRenderLoop(() => {
    monJoueur.update(); // CRUCIAL : calcule le mouvement avant le rendu
    game.update(); // Met à jour la logique du jeu
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
