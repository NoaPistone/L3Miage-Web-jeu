import {
    SceneLoader,
    Vector3,
    UniversalCamera
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class Joueur {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        this.inputMap = {};
        this.root = null;
        this.skeleton = null;
        this.camera = null;

        this.vitesse = 0.08;
        this.mouseSensitivity = 0.0025;

        this.yaw = 0;
        this.pitch = 0;

        this.isLoaded = false;

        this._setupInputs();
        this._setupMouseLook();

        this.camera = new UniversalCamera(
            "fpsCamera",
            new Vector3(0, 1.72, 0.22),
            this.scene
        );

        this.camera.minZ = 0.05;
        this.camera.fov = 1.1;
        this.camera.inputs.clear();

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
        // masque le curseur quand il n'est pas lock aussi
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
    if (!this.root || !this.camera) return;

    this.yaw += e.movementX * this.mouseSensitivity;
    this.pitch += e.movementY * this.mouseSensitivity;

    const maxPitch = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    this.root.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
});
    }

    async _chargerModele() {
    const result = await SceneLoader.ImportMeshAsync(
        "",
        "/assets/",
        "character.glb",
        this.scene
    );

    this.root = result.meshes[0];
    this.root.scaling = new Vector3(1, 1, 1);
    this.root.position = new Vector3(0, 0, 0);
    this.root.rotationQuaternion = null;
    this.root.rotation.y = 0;

    if (result.skeletons && result.skeletons.length > 0) {
        this.skeleton = result.skeletons[0];
    }

    console.log("=== LISTE DES MESHES ===");
    result.meshes.forEach((mesh, index) => {
        console.log(index, mesh.name);
    });

    // Cacher la tête pour la vue FPS
    result.meshes.forEach((mesh) => {
        const name = mesh.name.toLowerCase();

        if (
            name.includes("head") ||
            name.includes("eye") ||
            name.includes("hair") ||
            name.includes("face") ||
            name.includes("mask") ||
            name.includes("helmet")
        ) {
            mesh.isVisible = false;
        }
    });


    this.camera.parent = this.root;
    this.camera.minZ = 0.05;
    this.camera.fov = 1.1;
    this.camera.inputs.clear();

    this.scene.activeCamera = this.camera;

    this.isLoaded = true;
}

    update() {
        if (!this.isLoaded || !this.root) return;

        // direction avant selon l'orientation actuelle du perso
        const forward = new Vector3(
            Math.sin(this.root.rotation.y),
            0,
            Math.cos(this.root.rotation.y)
        );

        // direction droite perpendiculaire
        const right = new Vector3(
            forward.z,
            0,
            -forward.x
        );

        let move = Vector3.Zero();

        if (this.inputMap["z"]) {
            move.addInPlace(forward);
        }

        if (this.inputMap["s"]) {
            move.addInPlace(forward.scale(-1));
        }

        if (this.inputMap["q"]) {
            move.addInPlace(right.scale(-1));
        }

        if (this.inputMap["d"]) {
            move.addInPlace(right);
        }

        if (move.lengthSquared() > 0) {
            move.normalize();
            move.scaleInPlace(this.vitesse);
            this.root.position.addInPlace(move);
        }
    }
}