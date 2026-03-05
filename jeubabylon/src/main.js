import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

const createScene = () => {
    const scene = new Scene(engine);

    // 1. La Caméra (elle tourne autour du centre 0,0,0)
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 5, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // 2. La Lumière (pour voir les volumes)
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // 3. LA BOULE (au milieu de rien)
    MeshBuilder.CreateSphere("maBoule", { diameter: 2 }, scene);

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});