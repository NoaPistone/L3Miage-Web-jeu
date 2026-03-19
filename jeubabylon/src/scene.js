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

export function addGround(scene) {
    // 1. Création du plan pour le sol (Taille 44 pour couvrir le labyrinthe de 40)
    const ground = MeshBuilder.CreateGround("ground", { width: 90, height: 90 }, scene);
    
    // 2. Création du matériau
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    
    // 3. Chargement de ta texture PNG
    const groundTextureUrl = new URL("./assets/textures/ground1.jpg", import.meta.url).href;
    const groundTexture = new Texture(groundTextureUrl, scene);
    
    // Optionnel : Si ton image est une petite dalle que tu veux répéter :
    groundTexture.uScale = 20; // Répète 10 fois horizontalement
    groundTexture.vScale = 20; // Répète 10 fois verticalement
    
    groundMaterial.diffuseTexture = groundTexture;
    
    // On retire la brillance
    groundMaterial.specularColor = new Color3(0, 0, 0);
    
    ground.material = groundMaterial;

    // 4. Activation des collisions pour que le joueur ne tombe pas
    ground.checkCollisions = true;

    return ground;
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

// --- TA FONCTION PLAFOND (L'image de pierre) ---
export function addCeiling(scene, wallHeight) {
    const ceiling = MeshBuilder.CreateGround("ceiling", { width: 100, height: 100 }, scene);
    ceiling.position.y = wallHeight;
    
    // On le retourne
    ceiling.rotation.x = Math.PI; 

    const ceilingMaterial = new StandardMaterial("ceilingMat", scene);
    
    // 1. Correction du chemin
    const textureUrl = new URL("./assets/textures/wall4.jpg", import.meta.url).href;
    ceilingMaterial.diffuseTexture = new Texture(textureUrl, scene);
    
    // 2. Correction de la visibilité (Double face)
    ceilingMaterial.backFaceCulling = false; 
    
    // 3. Correction de la luminosité (Pour ne pas qu'il soit noir)
    ceilingMaterial.emissiveColor = new Color3(0.3, 0.3, 0.3); 
    
    // 4. Répétition pour que ce soit joli
    ceilingMaterial.diffuseTexture.uScale = 20;
    ceilingMaterial.diffuseTexture.vScale = 20;

    ceilingMaterial.specularColor = new Color3(0, 0, 0);
    ceiling.material = ceilingMaterial;

    console.log("Plafond créé à la hauteur : " + wallHeight);
    return ceiling;
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

