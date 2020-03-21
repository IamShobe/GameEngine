import {RectCollision} from "./CollisionBox";

let objectsCount = 0;

export class GameObject {
    constructor(game, x, y, w, h) {
        this.game = game;
        this.transform = {x, y, w, h};
        this.id = objectsCount++;

        this.collision = new RectCollision(x, y, w, h);

        this.moveVector = {x: 0, y: 0};
        this.lastMoved = {x: 0, y: 0};
    }

    update(delta) {

    }

    collides(obj) {
        return this.collision.rectCollides(obj.collision) || obj.collision.rectCollides(this.collision);
    }

    // optimizes renders outside of view
    shouldRender(view) {
        return true;
    }

    undoMinimal(obj) {
        const dirVec = {
            x: this.moveVector.x ? this.moveVector.x / Math.abs(this.moveVector.x) : 0,
            y: this.moveVector.y ? this.moveVector.y / Math.abs(this.moveVector.y) : 0,
        };

        this.transform.x -= dirVec.x;
        this.collision.transform.x -= dirVec.x;
        this.transform.y -= dirVec.y;
        this.collision.transform.y -= dirVec.y;
    }

    draw(ctx, debugConfig) {
        ctx.save();
        ctx.fillRect(this.transform.x, this.transform.y, this.transform.w, this.transform.h);
        if (debugConfig.debug && debugConfig.objectLabels) {
            ctx.fillStyle = '#FFF';
            ctx.fillText(this.id, this.transform.x + 20, this.transform.y + 20)
        }
        ctx.restore();
    }

    update(delta) {
        this.transform.x += this.moveVector.x;
        this.collision.transform.x += this.moveVector.x;
        this.transform.y += this.moveVector.y;
        this.collision.transform.y += this.moveVector.y;
    }
}

export default GameObject;
