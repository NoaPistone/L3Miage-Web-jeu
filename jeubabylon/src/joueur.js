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
            new Vector3(0, 1.58, -0.08),
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
        console.log("=== DEBUT CHARGEMENT character.glb ===");

        const result = await SceneLoader.ImportMeshAsync(
            "",
            "/assets/",
            "character.glb",
            this.scene
        );

        console.log("=== MODELE CHARGE ===");
        console.log("Nombre de meshes :", result.meshes.length);
        console.log("Nombre de skeletons :", result.skeletons.length);
        console.log("Meshes bruts :", result.meshes);

        console.log("=== LISTE DES MESHES ===");
        result.meshes.forEach((mesh, index) => {
            console.log(index, {
                name: mesh.name,
                id: mesh.id,
                isVisible: mesh.isVisible,
                parent: mesh.parent ? mesh.parent.name : null,
                position: mesh.position ? mesh.position.clone() : null
            });
        });

        // Sélection du mesh principal
        this.root = result.meshes.find(mesh => mesh.name !== "__root__") || result.meshes[0];

        console.log("=== ROOT SELECTIONNE ===");
        console.log("root.name =", this.root?.name);
        console.log("root.id =", this.root?.id);

        // Bounding box avant modifs
        if (this.root?.getHierarchyBoundingVectors) {
            const boundsBefore = this.root.getHierarchyBoundingVectors();
            console.log("Bounds avant parentage :", boundsBefore);
        }

        // Parentage au collider
        this.root.parent = this.collider;
        this.root.scaling = new Vector3(1, 1, 1);
        this.root.position = new Vector3(0, -0.9, 0.08);
        this.root.rotationQuaternion = null;
        this.root.rotation = new Vector3(0, 0, 0);

        console.log("=== APRES PARENTAGE ===");
        console.log("collider.position =", this.collider.position.clone());
        console.log("camera.localPosition =", this.camera.position.clone());
        console.log("root.localPosition =", this.root.position.clone());
        console.log("root.parent =", this.root.parent ? this.root.parent.name : null);

        if (result.skeletons && result.skeletons.length > 0) {
            this.skeleton = result.skeletons[0];
            console.log("Skeleton sélectionné :", this.skeleton.name);
        }

        // Log des meshes qui vont être cachés
        console.log("=== MESHES CACHES POUR LA VUE FPS ===");
        result.meshes.forEach((mesh) => {
            const name = mesh.name.toLowerCase();

            const shouldHide =
                name.includes("head") ||
                name.includes("eye") ||
                name.includes("hair") ||
                name.includes("face") ||
                name.includes("mask") ||
                name.includes("helmet");

            if (shouldHide) {
                console.log("HIDE ->", mesh.name);
                mesh.isVisible = false;
            } else {
                console.log("KEEP ->", mesh.name);
            }
        });

        // Etat final utile
        console.log("=== ETAT FINAL ROOT ===");
        console.log({
            rootName: this.root.name,
            rootVisible: this.root.isVisible,
            rootEnabled: this.root.isEnabled(),
            rootLocalPosition: this.root.position.clone(),
            colliderPosition: this.collider.position.clone(),
            cameraLocalPosition: this.camera.position.clone()
        });

        this.isLoaded = true;
        console.log("=== FIN CHARGEMENT JOUEUR ===");

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