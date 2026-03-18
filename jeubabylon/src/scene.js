import { MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";
import { Joueur } from "./joueur.js"; 

export function addSkybox(scene) {
    // Création du cube géant
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;

    // Chargement Vite-compatible des 6 faces du skybox depuis `src/assets/skybox`
    const px = new URL("./assets/skybox/skybox_px.jpg", import.meta.url).href;
    const py = new URL("./assets/skybox/skybox_py.jpg", import.meta.url).href;
    const pz = new URL("./assets/skybox/skybox_pz.jpg", import.meta.url).href;
    const nx = new URL("./assets/skybox/skybox_nx.jpg", import.meta.url).href;
    const ny = new URL("./assets/skybox/skybox_ny.jpg", import.meta.url).href;
    const nz = new URL("./assets/skybox/skybox_nz.jpg", import.meta.url).href;

    const reflection = CubeTexture.CreateFromImages([px, py, pz, nx, ny, nz], scene);
    reflection.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.reflectionTexture = reflection;

    skyboxMaterial.diffuseColor = new Color3(0,0,0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);

    skybox.material = skyboxMaterial;
}

export async function addGround(scene) {
    const groundUrl = new URL("./assets/textures/ground.glb", import.meta.url).href;

    try {
        const result = await SceneLoader.ImportMeshAsync("", "", groundUrl, scene);
        const groundRoot = result.meshes[0];

        // 1. On récupère les dimensions réelles du modèle GLB
        const boundingInfo = groundRoot.getHierarchyBoundingVectors();
        const currentWidth = boundingInfo.max.x - boundingInfo.min.x;
        const currentDepth = boundingInfo.max.z - boundingInfo.min.z;

        // 2. On définit la taille souhaitée (Labyrinthe 40 + Marge 4 = 44)
        const targetSize = 44; 

        // 3. Calcul du ratio
        const scaleX = currentWidth !== 0 ? targetSize / currentWidth : 1;
        const scaleZ = currentDepth !== 0 ? targetSize / currentDepth : 1;

        // 4. Application du scaling
        groundRoot.scaling = new Vector3(scaleX, 1, scaleZ);

        // Centrage parfait à l'origine
        groundRoot.position = new Vector3(0, 0, 0);

        // Configuration des collisions et du rendu
        result.meshes.forEach(mesh => {
            mesh.checkCollisions = true;
            if (mesh.material) {
                // On retire la brillance pour un aspect plus réaliste
                mesh.material.specularColor = new Color3(0, 0, 0);
            }
        });

        console.log(`Sol GLB redimensionné à ${targetSize}x${targetSize}`);
        return groundRoot;

    } catch (error) {
        console.error("Erreur lors du chargement du sol GLB :", error);
    }
}

export function addGround1(scene) {
    const ground = MeshBuilder.CreateGround(
        "ground",
        { width: 40, height: 40 },
        scene
    );

    const groundMaterial = new StandardMaterial("groundMaterial", scene);

    // Gris très sombre
    groundMaterial.diffuseColor = new Color3(0.18, 0.18, 0.18);

    // Supprime l’effet brillant qui crée des ronds lumineux
    groundMaterial.specularColor = new Color3(0, 0, 0);

    ground.material = groundMaterial;

    return ground;
}




export function setupLightingAndFog(scene) {
    // Lumière faible
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.4; // un peu plus lumineux pour voir les murs


    // Fond noir 
    ////scene.fogMode = 1; 
    ////scene.fogDensity = 0.02;
    ////scene.fogColor = new Color3(0.02, 0.02, 0.02);
}

