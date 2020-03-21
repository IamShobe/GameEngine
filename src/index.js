import {HEIGHT, WIDTH} from "./consts";
import {Game} from "./engine/Game";
import {Scene} from "./engine/Scene";


const canvas = document.getElementById('canvas');

const game = new Game(canvas, WIDTH, HEIGHT);
game.addScene(new Scene(game, WIDTH * 2, HEIGHT * 2));

game.run();

window.game = game;


// TO DELETE

const settings = {
    debug: document.getElementById('debugMode'),
    worldBorder: document.getElementById('worldBorder'),
    collisionBoxes: document.getElementById('collisionBoxes'),
    quadTree: document.getElementById('quadTree'),
    objectLabels: document.getElementById('labels'),
    hud: document.getElementById('hud')
};

const updateSettings = () => {
    game.debugConfig.updateElem(settings)
};
updateSettings();
window.updateSettings = updateSettings;
