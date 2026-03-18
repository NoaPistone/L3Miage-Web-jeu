import {
    SceneLoader,
    SceneLoaderAnimationGroupLoadingMode,
    Vector3,
    FollowCamera
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const PlayerState = Object.freeze({
    IDLE: "idle",
    WALK_FORWARD: "walk_forward",
    WALK_BACKWARD: "walk_backward",
    STRAFE_LEFT: "strafe_left",
    STRAFE_RIGHT: "strafe_right",
    JUMP: "jump"
});

export class Joueur {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        this.inputMap = {};
        this.root = null;
        this.skeleton = null;
        this.camera = null;

        this.vitesse = 0.08;

        this.state = PlayerState.IDLE;
        this.currentAnim = null;
        this.previousSpacePressed = false;
        this.isLoaded = false;

        this.animations = {
            [PlayerState.WALK_FORWARD]: null,
            [PlayerState.WALK_BACKWARD]: null,
            [PlayerState.STRAFE_LEFT]: null,
            [PlayerState.STRAFE_RIGHT]: null,
            [PlayerState.JUMP]: null
        };

        this._setupInputs();
        this._chargerModele();
    }

    _setupInputs() {
        window.addEventListener("keydown", (e) => {
            this.inputMap[e.key.toLowerCase()] = true;

            if (e.code === "Space") {
                this.inputMap.space = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            this.inputMap[e.key.toLowerCase()] = false;

            if (e.code === "Space") {
                this.inputMap.space = false;
            }
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
        this.root.rotation.y = Math.PI;

        if (result.skeletons && result.skeletons.length > 0) {
            this.skeleton = result.skeletons[0];
        }

        if (result.animationGroups && result.animationGroups.length > 0) {
            result.animationGroups.forEach((group) => {
                group.stop();
                group.reset();
            });
        }

        this.animations[PlayerState.WALK_FORWARD] = await this._loadAnimation("walking.glb");
        this.animations[PlayerState.WALK_BACKWARD] = await this._loadAnimation("Walking Backwards.glb");
        this.animations[PlayerState.STRAFE_LEFT] = await this._loadAnimation("Left Strafe Walking.glb");
        this.animations[PlayerState.STRAFE_RIGHT] = await this._loadAnimation("Right Strafe Walking.glb");
        this.animations[PlayerState.JUMP] = await this._loadAnimation("Jumping.glb");

        if (this.animations[PlayerState.JUMP]) {
            this.animations[PlayerState.JUMP].onAnimationGroupEndObservable.add(() => {
                if (this.state === PlayerState.JUMP) {
                    this.setState(this._getMovementState());
                }
            });
        }

        this.camera = new FollowCamera(
            "FollowCam",
            new Vector3(0, 10, -20),
            this.scene
        );
        this.camera.radius = 10;
        this.camera.heightOffset = 4;
        this.camera.lockedTarget = this.root;

        this.isLoaded = true;
        this.setState(PlayerState.IDLE);
    }

    async _loadAnimation(fileName) {
        const beforeIds = new Set(this.scene.animationGroups.map((g) => g.uniqueId));

        await SceneLoader.ImportAnimationsAsync(
            "/assets/",
            fileName,
            this.scene,
            false,
            SceneLoaderAnimationGroupLoadingMode.Stop
        );

        const newGroups = this.scene.animationGroups.filter(
            (g) => !beforeIds.has(g.uniqueId)
        );

        if (newGroups.length === 0) {
            console.error(`Aucun animationGroup importé depuis ${fileName}`);
            return null;
        }

        const group = newGroups[0];
        group.stop();
        group.reset();
        group.enableBlending = true;
        group.blendingSpeed = 0.1;

        return group;
    }

    _stopCurrentAnimation() {
        if (!this.currentAnim) return;

        this.currentAnim.stop();
        this.currentAnim.reset();
        this.currentAnim = null;
    }

    _goIdle() {
        this._stopCurrentAnimation();
        this.state = PlayerState.IDLE;

        if (this.skeleton) {
            this.skeleton.returnToRest();
        }
    }

    setState(newState) {
        if (!this.isLoaded) return;
        if (this.state === newState) return;

        this._stopCurrentAnimation();

        if (newState === PlayerState.IDLE) {
            this._goIdle();
            return;
        }

        const anim = this.animations[newState];

        if (!anim) {
            this._goIdle();
            return;
        }

        this.state = newState;
        this.currentAnim = anim;

        const loop = newState !== PlayerState.JUMP;
        anim.start(loop, 1.0, anim.from, anim.to, false);
    }

    _getMovementState() {
        if (this.inputMap["z"]) return PlayerState.WALK_FORWARD;
        if (this.inputMap["s"]) return PlayerState.WALK_BACKWARD;
        if (this.inputMap["q"]) return PlayerState.STRAFE_LEFT;
        if (this.inputMap["d"]) return PlayerState.STRAFE_RIGHT;
        return PlayerState.IDLE;
    }

    _applyMovement(state) {
        switch (state) {
            case PlayerState.WALK_FORWARD:
                this.root.position.z += this.vitesse;
                this.root.rotation.y = 0;
                break;

            case PlayerState.WALK_BACKWARD:
                this.root.position.z -= this.vitesse;
                this.root.rotation.y = Math.PI;
                break;

            case PlayerState.STRAFE_LEFT:
                this.root.position.x -= this.vitesse;
                this.root.rotation.y = -Math.PI / 2;
                break;

            case PlayerState.STRAFE_RIGHT:
                this.root.position.x += this.vitesse;
                this.root.rotation.y = Math.PI / 2;
                break;
        }
    }

    update() {
        if (!this.isLoaded || !this.root) return;

        const spacePressed = !!this.inputMap.space;
        const jumpJustPressed = spacePressed && !this.previousSpacePressed;
        this.previousSpacePressed = spacePressed;

        if (jumpJustPressed && this.state !== PlayerState.JUMP) {
            this.setState(PlayerState.JUMP);
            return;
        }

        if (this.state === PlayerState.JUMP) {
            return;
        }

        const wantedState = this._getMovementState();

        this._applyMovement(wantedState);
        this.setState(wantedState);
    }
}