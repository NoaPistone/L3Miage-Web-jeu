import { MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";
import { Joueur } from "./joueur.js"; 

export function addSkybox(scene) {
    
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;

    
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
    
    const ground = MeshBuilder.CreateGround("ground", { width: 90, height: 90 }, scene);
    
    
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    
    
    const groundTextureUrl = new URL("./assets/textures/ground1.jpg", import.meta.url).href;
    const groundTexture = new Texture(groundTextureUrl, scene);
    
     
    groundTexture.uScale = 20; 
    groundTexture.vScale = 20; 
    
    groundMaterial.diffuseTexture = groundTexture;
    
    
    groundMaterial.specularColor = new Color3(0, 0, 0);
    
    ground.material = groundMaterial;

    
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

    
    groundMaterial.diffuseColor = new Color3(0.18, 0.18, 0.18);

   
    groundMaterial.specularColor = new Color3(0, 0, 0);

    ground.material = groundMaterial;

    return ground;
}


export function addCeiling(scene, wallHeight) {
    const ceiling = MeshBuilder.CreateGround("ceiling", { width: 100, height: 100 }, scene);
    ceiling.position.y = wallHeight;
    
    
    ceiling.rotation.x = Math.PI; 

    const ceilingMaterial = new StandardMaterial("ceilingMat", scene);
    
    
    const textureUrl = new URL("./assets/textures/wall4.jpg", import.meta.url).href;
    ceilingMaterial.diffuseTexture = new Texture(textureUrl, scene);
    
    
    ceilingMaterial.backFaceCulling = false; 
    
    
    ceilingMaterial.emissiveColor = new Color3(0.3, 0.3, 0.3); 
    
    
    ceilingMaterial.diffuseTexture.uScale = 20;
    ceilingMaterial.diffuseTexture.vScale = 20;

    ceilingMaterial.specularColor = new Color3(0, 0, 0);
    ceiling.material = ceilingMaterial;

    console.log("Plafond créé à la hauteur : " + wallHeight);
    return ceiling;
}




export function setupLightingAndFog(scene) {
    
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.4; 
}

