import {
    SceneLoader,
    Vector3,
    UniversalCamera,
    MeshBuilder
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class Joueur {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        this.scene.collisionsEnabled = true;

        this.vitesse = 0.08;
        this.mouseSensitivity = 0.0025;

        this.inputMap = {};
        this.root = null;        // modèle visuel
        this.collider = null;    // collisions + déplacement
        this.skeleton = null;
        this.camera = null;

        this.yaw = 0;
        this.pitch = 0;
        this.isLoaded = false;

        // Collider invisible
        this.collider = MeshBuilder.CreateBox(
            "playerCollider",
            { width: 0.8, depth: 0.8, height: 1.8 },
            this.scene
        );
        this.collider.isVisible = false;
        this.collider.position = new Vector3(0, 0.9, 0);
        this.collider.checkCollisions = true;
        this.collider.ellipsoid = new Vector3(0.4, 0.9, 0.4);
        this.collider.ellipsoidOffset = new Vector3(0, 0.9, 0);

        this._setupInputs();
        this._setupMouseLook();

        this.camera = new UniversalCamera(
    "fpsCamera",
    new Vector3(0, 0.78, 0.17),
    this.scene
);

        this.camera.minZ = 0.05;
        this.camera.fov = 1.1;
        this.camera.inputs.clear();
        this.camera.parent = this.collider;

        this.scene.activeCamera = this.camera;

        this._chargerModele();
    }

    _setupInputs() {
        window.addEventListener("keydown", (e) => {
            this.inputMap[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.inputMap[e.key.toLowerCase()] = false;
        });
    }

    _setupMouseLook() {
        this.canvas.style.cursor = "none";

        this.canvas.addEventListener("click", async () => {
            if (document.pointerLockElement !== this.canvas) {
                try {
                    await this.canvas.requestPointerLock();
                } catch (err) {
                    console.error("Pointer lock refusé :", err);
                }
            }
        });

        document.addEventListener("mousemove", (e) => {
            if (document.pointerLockElement !== this.canvas) return;
            if (!this.collider || !this.camera) return;

            this.yaw += e.movementX * this.mouseSensitivity;
            this.pitch += e.movementY * this.mouseSensitivity;

            const maxPitch = Math.PI / 2 - 0.05;
            this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

            this.collider.rotation.y = this.yaw;
            this.camera.rotation.x = this.pitch;
        });
    }

    async _chargerModele() {
    try {
        const result = await SceneLoader.ImportMeshAsync(
            "",
            "/assets/",
            "character.glb",
            this.scene
        );

        console.log("=== MODELE CHARGE ===");
        console.log("Meshes :", result.meshes.map(m => m.name));

        const importedRoot = result.meshes[0];   // __root__
        const bodyMesh = result.meshes[1];       // Ch24

        this.root = importedRoot;
        this.bodyMesh = bodyMesh;

        // On garde toute la hiérarchie importée
        this.root.parent = this.collider;
        this.root.scaling = new Vector3(1, 1, 1);
        this.root.position = new Vector3(0, -0.9, 0);
        this.root.rotationQuaternion = null;
        this.root.rotation = new Vector3(0, 0, 0);

        if (result.skeletons && result.skeletons.length > 0) {
            this.skeleton = result.skeletons[0];
        }

        // DEBUG VISUEL
        this.bodyMesh.isVisible = true;
        this.bodyMesh.setEnabled(true);
        this.bodyMesh.showBoundingBox = false;

        if (this.bodyMesh.material) {
            this.bodyMesh.material.backFaceCulling = false;
        }

        console.log("root =", this.root.name);
        console.log("bodyMesh =", this.bodyMesh.name);
        console.log("collider.position =", this.collider.position.clone());
        console.log("camera.localPosition =", this.camera.position.clone());
        console.log("root.localPosition =", this.root.position.clone());
        console.log("body absolute position =", this.bodyMesh.getAbsolutePosition().clone());

        this.isLoaded = true;
    } catch (error) {
        console.error("Erreur chargement character.glb :", error);
    }
}

    update() {
    if (!this.collider) return;

    if (this.isLoaded && this.root && !this._debugLogged) {
        this._debugLogged = true;
        console.log("=== DEBUG POSITION AU PREMIER UPDATE ===");
        console.log("collider =", this.collider.position.clone());
        console.log("root local =", this.root.position.clone());
        console.log("camera local =", this.camera.position.clone());
    }

    const forward = new Vector3(
        Math.sin(this.collider.rotation.y),
        0,
        Math.cos(this.collider.rotation.y)
    );

    const right = new Vector3(
        forward.z,
        0,
        -forward.x
    );

    let move = Vector3.Zero();

    if (this.inputMap["z"]) move.addInPlace(forward);
    if (this.inputMap["s"]) move.addInPlace(forward.scale(-1));
    if (this.inputMap["q"]) move.addInPlace(right.scale(-1));
    if (this.inputMap["d"]) move.addInPlace(right);

    if (move.lengthSquared() > 0) {
        move.normalize();
        move.scaleInPlace(this.vitesse);
        this.collider.moveWithCollisions(move);
    }
}
}