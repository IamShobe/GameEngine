import Camera from "./Camera";
import GameObject from "./Object";
import {HUD} from "./HUD";
import {CollisionSpace} from "./CollisionSpace";
import {Player} from "./Player";

export class Scene {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.player = new Player(game, 500, 30);
        this.objects = [
            new GameObject(game, 10, 10, 100, 100),
            new GameObject(game, 10, 400, 100, 100),
            new GameObject(game, 120, 190, 100, 100),
            new GameObject(game, 150, 500, 100, 100),
            new GameObject(game, 550, 500, 100, 100),
            new GameObject(game, 550, 620, 100, 100),
            new GameObject(game, 670, 620, 100, 100),
            new GameObject(game, 670, 730, 100, 100),
            new GameObject(game, 790, 730, 100, 100),
            this.player
        ];
        this.space = null;
        this.camera = new Camera(game);
        this.fps = 0;
        this.hud = new HUD(game);
    }

    update(delta) {
        this.fps = Math.floor(1000 / delta);
        delete this.space;
        this.space = new CollisionSpace(this);
        // update all objects
        this.objects.forEach(
            object => object.update(delta)
        );
        // add objects to quad tree
        this.objects.forEach(obj => this.space.add(obj));

        // check collisions
        this.objects.forEach(object => {
            const potentialCollides = this.space.getPotentialCollisions(object);
            const collidedO = [];
            potentialCollides.forEach(collides => {
                // check collisions with object
                if (collides.collides(object)) {
                    collidedO.push(collides);
                }
            });
            collidedO.forEach(c => {
                while (object.collides(c)) {
                    object.undoMinimal(c); // move object back
                    c.undoMinimal(object); // move c back
                }
            });
        });
    }

    _draw(ctx, debugConfig) {
        if (!debugConfig.debug || !debugConfig.worldBorder) return;
        ctx.strokeStyle = "#6405ff";
        ctx.strokeRect(0, 0, this.width, this.height);
    }

    draw(ctx) {
        ctx.save();
        this.camera.move(ctx);
        const debugConfig = this.game.debugConfig;
        this.objects.forEach(object =>
            object.shouldRender(this.camera.view) && object.draw(ctx, debugConfig)
        );

        this.space.draw(ctx, debugConfig);
        this._draw(ctx, debugConfig);
        ctx.restore();

        // paint without camera view relation
        if (debugConfig.debug && debugConfig.hud) {
            this.hud.draw(ctx, debugConfig);
        }
    }
}

export default Scene;
