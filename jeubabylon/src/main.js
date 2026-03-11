import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3 } from "@babylonjs/core";
import { Joueur } from "./joueur"; 
import { addSkybox, addGround, setupLightingAndFog } from "./scene";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

const createScene = () => {
    const scene = new Scene(engine);

    // Caméra de côté pour bien voir le mouvement
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    
    // On crée l'instance du joueur
    const monJoueur = new Joueur(scene);

    return { scene, monJoueur };
};

const { scene, monJoueur } = createScene();
addSkybox(scene);
addGround(scene);
setupLightingAndFog(scene);

engine.runRenderLoop(() => {
    monJoueur.update(); // CRUCIAL : calcule le mouvement avant le rendu
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});