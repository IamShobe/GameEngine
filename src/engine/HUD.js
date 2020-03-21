import {Container} from "./Container";
import {Text} from "./Text";

export class HUD {
    constructor(game) {
        this.game = game;
    }

    async draw(ctx) {
        const {x, y, zoom} = this.game.currentScene.camera.view;
        const mPos = this.game.currentScene.camera.getPoint(this.game.input.mouse.pos);
        const fps = this.game.currentScene.fps;

        await new Container(0, this.game.height, {
            width: 200,
            alignH: 'bottom',
            direction: 'column'
        }).addAll([
            new Text(`FPS: ${fps}`),
            new Text(`Pos: ${x}, ${y}`),
            new Text(`mPos: ${mPos.x}, ${mPos.y}`),
            new Text(`Zoom: ${zoom}`),
        ]).draw(ctx);
    }
}