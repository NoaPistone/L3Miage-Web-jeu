import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder} from "@babylonjs/core";
import { Joueur } from "./joueur";
import { addSkybox, addGround, setupLightingAndFog } from "./scene";
import { GameManager } from "./gameManager";


const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);
engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
engine.adaptToDeviceRatio = true;

const createScene = () => {
    const scene = new Scene(engine);
    scene.collisionsEnabled = true;

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const monJoueur = new Joueur(scene, canvas);

        // On crée le GameManager qui gère les labyrinthes et la logique de progression
    const game = new GameManager(scene, monJoueur);

    return { scene, monJoueur, game };
};



const { scene, monJoueur, game } = createScene();
addSkybox(scene);
addGround(scene);
setupLightingAndFog(scene);

engine.runRenderLoop(() => {
    monJoueur.update();
    game.update();

    if (scene.activeCamera) {
        scene.render();
    }
});

window.addEventListener("resize", () => {
    engine.resize();
});
