import { Engine, Scene, Vector3, HemisphericLight } from "@babylonjs/core";
import { Joueur } from "./joueur";
import { addSkybox, addGround, setupLightingAndFog, addCeiling } from "./scene";
import { GameManager } from "./gameManager";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);
engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
engine.adaptToDeviceRatio = true;

const mainMenu = document.getElementById("mainMenu");
const levelMenu = document.getElementById("levelMenu");

const storyBtn = document.getElementById("storyBtn");
const levelBtn = document.getElementById("levelBtn");
const quitBtn = document.getElementById("quitBtn");
const backBtn = document.getElementById("backBtn");
const levelButtonsContainer = document.getElementById("levelButtons");

const hudDroit = document.getElementById("hudDroit");
const hudGauche = document.getElementById("hudGauche");
const hudMilieu = document.getElementById("hudMilieu");


const introScreen = document.getElementById("introScreen");
const introBtn = document.getElementById("introBtn");
const introText = document.getElementById("introText");
const levelIntro = document.getElementById("levelIntro");
const levelIntroBtn = document.getElementById("levelIntroBtn");
const levelIntroText = document.getElementById("levelIntroText");

const aideBtn = document.getElementById("aideBtn");
const aide = document.getElementById("aide");
const aideRetourBtn = document.getElementById("aideRetourBtn");



let gameStarted = false;

const createScene = () => {
    const scene = new Scene(engine);
    scene.collisionsEnabled = true;

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const monJoueur = new Joueur(scene, canvas);
    const game = new GameManager(scene, monJoueur, false);

    return { scene, monJoueur, game };
};

const { scene, monJoueur, game } = createScene();

addSkybox(scene);
addGround(scene);
addCeiling(scene, 6);
setupLightingAndFog(scene);

function showHud(show) {
    const value = show ? "block" : "none";
    hudDroit.style.display = value;
    hudGauche.style.display = value;
    hudMilieu.style.display = value;
}

function openMainMenu() {
    mainMenu.classList.remove("hidden");
    levelMenu.classList.add("hidden");
}

function openLevelMenu() {
    mainMenu.classList.add("hidden");
    levelMenu.classList.remove("hidden");
}

function hideMenus() {
    mainMenu.classList.add("hidden");
    levelMenu.classList.add("hidden");
}

function showLevelIntro(levelIndex, callback) {
    const text = game.getLevelIntroText(levelIndex);
    console.log("Phrase niveau", levelIndex, ":", text); 
    if (!text) { callback(); return; }
    if (document.exitPointerLock) {
        document.exitPointerLock();
    }
    levelIntroText.textContent = text;
    levelIntro.classList.remove("hidden");
    levelIntroBtn.onclick = () => {
        levelIntro.classList.add("hidden");
        canvas.requestPointerLock();
        callback();
    };
}
window.showLevelIntro = showLevelIntro;

function startStory() {
    hideMenus();
    introText.textContent = game.getIntroText();
    introScreen.classList.remove("hidden");
}




introBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    showHud(true);
    gameStarted = true;
    showLevelIntro(0, () => {
        canvas.requestPointerLock();
        game.startStoryMode();
    });
});

function startSelectedLevel(levelIndex) {
    hideMenus();
    showHud(true);
    game.startLevelMode(levelIndex);
    gameStarted = true;
}

function buildLevelButtons() {
    levelButtonsContainer.innerHTML = "";

    game.levels.forEach((_, index) => {
        const button = document.createElement("button");
        button.className = "menuButton";
        button.textContent = `Level ${index + 1}`;
        button.addEventListener("click", () => {
            startSelectedLevel(index);
        });

        levelButtonsContainer.appendChild(button);
    });
}

storyBtn.addEventListener("click", startStory);
levelBtn.addEventListener("click", openLevelMenu);
backBtn.addEventListener("click", openMainMenu);

quitBtn.addEventListener("click", () => {
    window.close();

    setTimeout(() => {
        alert("Impossible de fermer automatiquement l’onglet depuis le navigateur.");
    }, 100);
});

buildLevelButtons();
showHud(false);
openMainMenu();

engine.runRenderLoop(() => {
    if (gameStarted) {
        monJoueur.update();
        game.update();
    }

    if (scene.activeCamera) {
        scene.render();
    }
});

window.addEventListener("resize", () => {
    engine.resize();
});

aideBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    aide.classList.remove("hidden");
});

aideRetourBtn.addEventListener("click", () => {
    aide.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});