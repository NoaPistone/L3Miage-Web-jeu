import { Engine, Scene, Vector3, HemisphericLight } from "@babylonjs/core";
import { Joueur } from "./joueur";
import { addSkybox, addGround, setupLightingAndFog } from "./scene";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);
engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
engine.adaptToDeviceRatio = true;

const createScene = () => {
    const scene = new Scene(engine);

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const monJoueur = new Joueur(scene, canvas);

    return { scene, monJoueur };
};

const { scene, monJoueur } = createScene();

addSkybox(scene);
addGround(scene);
setupLightingAndFog(scene);

engine.runRenderLoop(() => {
    monJoueur.update();

    if (scene.activeCamera) {
        scene.render();
    }
});

window.addEventListener("resize", () => {
    engine.resize();
});