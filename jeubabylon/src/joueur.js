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
        this.root = null;
        this.bodyMesh = null;
        this.collider = null;
        this.skeleton = null;
        this.headBone = null;
        this.camera = null;

        this.yaw = 0;
        this.pitch = 0;
        this.isLoaded = false;
        this._debugLogged = false;

        this.boostActif = false;
        this.boostTimeout = null;

        // Réglages caméra
        this.camForwardIdle = 0.18;
this.camForwardRun = 0.18;
this.currentCamForward = this.camForwardIdle;
this.camHeightOffset = 0.08;

        // Animations
        this.animationGroups = [];
        this.animStanding = null;
        this.animRunning = null;
        this.animActuelle = null;

        // Collider
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
            new Vector3(0, 1.6, 0),
            this.scene
        );

        this.camera.minZ = 0.05;
        this.camera.fov = 1.1;
        this.camera.inputs.clear();
        this.camera.speed = 0;
        this.camera.angularSensibility = 0;

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

            // Rotation horizontale du corps
            this.collider.rotation.y = this.yaw;
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
            console.log("AnimationGroups :", result.animationGroups.map(a => a.name));

            const importedRoot = result.meshes[0];

            this.root = importedRoot;
            this.root.parent = this.collider;
            this.root.scaling = new Vector3(1, 1, 1);
            this.root.position = new Vector3(0, -0.9, 0);
            this.root.rotationQuaternion = null;
            this.root.rotation = new Vector3(0, 0, 0);

            if (result.skeletons && result.skeletons.length > 0) {
                this.skeleton = result.skeletons[0];
                console.log("Bones :", this.skeleton.bones.map(b => b.name));
            }

            this.bodyMesh =
                result.meshes.find(m => m.skeleton === this.skeleton) ||
                result.meshes[1] ||
                null;

            if (!this.bodyMesh) {
                console.warn("Aucun bodyMesh trouvé.");
            } else {
                this.bodyMesh.isVisible = true;
                this.bodyMesh.setEnabled(true);
                this.bodyMesh.showBoundingBox = false;

                if (this.bodyMesh.material) {
                    this.bodyMesh.material.backFaceCulling = false;
                }
            }

            if (this.skeleton) {
                this.headBone =
                    this.skeleton.bones.find(b => /mixamorig:head/i.test(b.name)) ||
                    this.skeleton.bones.find(b => /^head$/i.test(b.name)) ||
                    this.skeleton.bones.find(b => /head/i.test(b.name)) ||
                    null;

                console.log("Head bone :", this.headBone?.name ?? "NON TROUVÉE");
            }

            this.animationGroups = result.animationGroups;

            this.animStanding = this.animationGroups.find(a =>
                a.name.toLowerCase().includes("standing") ||
                a.name.toLowerCase().includes("idle")
            );

            this.animRunning = this.animationGroups.find(a =>
                a.name.toLowerCase().includes("running") ||
                a.name.toLowerCase().includes("run")
            );

            console.log("Anim standing :", this.animStanding?.name ?? "NON TROUVÉE");
            console.log("Anim running  :", this.animRunning?.name ?? "NON TROUVÉE");

            this.animationGroups.forEach(a => a.stop());

            if (this.animStanding) {
                this.animStanding.start(true, 1.0, this.animStanding.from, this.animStanding.to, false);
                this.animActuelle = this.animStanding;
            }

            this.isLoaded = true;
            this._updateCameraFromHead();

        } catch (error) {
            console.error("Erreur chargement character.glb :", error);
        }
    }

    _jouerAnimation(anim) {
        if (!anim || anim === this.animActuelle) return;

        this.animationGroups.forEach(a => a.stop());
        anim.start(true, 1.0, anim.from, anim.to, false);
        this.animActuelle = anim;
    }

    _updateCameraFromHead() {
        if (!this.camera || !this.collider) return;

        const forward = new Vector3(
            Math.sin(this.yaw),
            0,
            Math.cos(this.yaw)
        );

        // Fallback si l’os de tête n’est pas trouvé
        if (!this.headBone || !this.bodyMesh) {
            const fallbackPos = this.collider.position
                .add(new Vector3(0, 0.78 + this.camHeightOffset, 0))
                .add(forward.scale(this.currentCamForward));

            this.camera.position.copyFrom(fallbackPos);
            this.camera.rotation.x = this.pitch;
            this.camera.rotation.y = this.yaw;
            this.camera.rotation.z = 0;
            return;
        }

        this.root?.computeWorldMatrix(true);
        this.bodyMesh.computeWorldMatrix(true);

        const headWorldPos = this.headBone.getAbsolutePosition(this.bodyMesh);

        const cameraWorldPos = headWorldPos
            .add(new Vector3(0, this.camHeightOffset, 0))
            .add(forward.scale(this.currentCamForward));

        this.camera.position.copyFrom(cameraWorldPos);
        this.camera.rotation.x = this.pitch;
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.z = 0;
    }

    update() {
        if (!this.collider) return;

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

        const enMouvement = move.lengthSquared() > 0;

        if (enMouvement) {
            move.normalize();
            move.scaleInPlace(this.vitesse);
            this.collider.moveWithCollisions(move);
        }

        if (this.isLoaded) {
            if (enMouvement) {
                this._jouerAnimation(this.animRunning);
            } else {
                this._jouerAnimation(this.animStanding);
            }

            const cibleOffset = enMouvement ? this.camForwardRun : this.camForwardIdle;
            this.currentCamForward += (cibleOffset - this.currentCamForward) * 0.15;

            this._updateCameraFromHead();
        }
    }

    activerBoost(duree = 10000) {
        if (this.boostActif) return;

        this.boostActif = true;
        this.vitesse = 0.18;
        console.log("⚡ Boost activé !");

        this.boostTimeout = setTimeout(() => {
            this.desactiverBoost();
        }, duree);
    }

    desactiverBoost() {
        this.vitesse = 0.08;
        this.boostActif = false;

        if (this.boostTimeout) {
            clearTimeout(this.boostTimeout);
            this.boostTimeout = null;
        }

        console.log("⚡ Boost terminé !");
    }
}