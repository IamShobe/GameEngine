import {HEIGHT, WIDTH} from "./consts";
import {Game} from "./engine/Game";
import {Scene} from "./engine/Scene";


const canvas = document.getElementById('canvas');

const game = new Game(canvas, WIDTH, HEIGHT);
game.addScene(new Scene(game, WIDTH * 2, HEIGHT * 2));

game.run();

window.game = game;