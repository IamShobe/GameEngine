import {RectCollision} from "./CollisionBox";

let objectsCount = 0;

export class GameObject {
    constructor(game, x, y, w, h, config={}) {
        const {allowCollisions = false, solid = true} = config;

        this.game = game;
        this.transform = {x, y, w, h};
        this.allowCollisions = allowCollisions;
        this.id = objectsCount++;

        this.collision = new RectCollision(x, y, w, h);
        this.solid = solid;

        this.lastMoved = {x: 0, y: 0};
        this.transformStack = [];
    }

    update(delta) {

    }

    collides(obj) {
        return this.collision.otherCollides(obj.collision);
    }

    pointCollides(x, y) {
        return this.collision.collides(x, y);
    }

    // optimizes renders outside of view
    shouldRender(view) {
        return true;
    }

    get dirVector() {
        const moveVec = this.moveVector;
        return {
            x: moveVec.x ? moveVec.x / Math.abs(moveVec.x) : 0,
            y: moveVec.y ? moveVec.y / Math.abs(moveVec.y) : 0,
        };
    }

    undoMinimal(obj) {
        const dirVec = this.dirVector;
        this.transform.x -= dirVec.x;
        this.collision.transform.x -= dirVec.x;
        this.transform.y -= dirVec.y;
        this.collision.transform.y -= dirVec.y;
    }

    draw(ctx, debugConfig) {
        ctx.save();
        ctx.fillRect(this.transform.x, this.transform.y, this.transform.w, this.transform.h);
        if (debugConfig.debug) {
            if (debugConfig.objectLabels) {
                ctx.save();
                ctx.fillStyle = '#FFF';
                ctx.fillText(this.id, this.transform.x + 20, this.transform.y + 20);
                ctx.restore();
            }
            if (debugConfig.collisionBoxes) {
                this.collision.draw(ctx, debugConfig);
            }
        }
        ctx.restore();
    }

    get space() {
        return this.game.currentScene.space;
    }

    save() {
        this.transformStack.push({...this.transform});
        this.collision.save();
    }

    restore() {
        this.transform = this.transformStack.pop();
        this.collision.restore();
        this.space.update(this);
    }

    commit() {
        this.transformStack.pop();
    }

    get moveVector() {
        return {x: 0, y: 0};
    }

    setX(value, abs=false) {
        if (abs) {
            this.transform.x = value;
            this.collision.transform.x = value
        } else {
            this.transform.x += value;
            this.collision.transform.x += value;
        }
        this.space.update(this);
    }

    setY(value, abs=false) {
        if (abs) {
            this.transform.y = value;
            this.collision.transform.y = value
        } else {
            this.transform.y += value;
            this.collision.transform.y += value;
        }
        this.space.update(this);
    }

    getCollides(predicate) {
        const collisions = this.space.getPotentialCollisions(this);
        let collides = [];
        collisions.forEach(coll => coll.collides(this) && collides.push(coll));
        if (predicate) {
            collides = collides.filter(predicate);
        }
        return collides;
    }

    fixCollisions(collides, type) {
        const dirVec = this.dirVector;
        collides.forEach(c => {
            if (["both", "horizontal"].includes(type) && dirVec.x === -1) { // object is moving left and collided
                this.setX(c.collision.getXOfY(this.collision.y, "right"), true)
            }
            if (["both", "horizontal"].includes(type) && dirVec.x === 1) { // object is moving right and collided
                this.setX(c.collision.getXOfY(this.collision.y, "left") - this.collision.width, true)
            }
            if (["both", "vertical"].includes(type) && dirVec.y === -1) { // object is moving up and collided
                this.setY(c.collision.getYOfX(this.collision.x, "bottom"), true)
            }
            if (["both", "vertical"].includes(type) && dirVec.y === 1) { // object is moving down and collided
                this.setY(c.collision.getYOfX(this.collision.x, "top") - this.collision.height, true)
            }
        });
    }

    movement(method, type) {
        if(!this.allowCollisions) {
            this.save();
        }
        method();
        if (!this.allowCollisions) {
            const collisions = this.getCollides(obj => obj.solid);
            if (collisions.length > 0) {
                this.restore();
                this.fixCollisions(collisions, type);
            } else this.commit();
        }
    }

    update(delta) {
        const moveVec = this.moveVector;
        moveVec.x && this.movement(() => this.setX(moveVec.x), "horizontal");
        moveVec.y && this.movement(() => this.setY(moveVec.y), "vertical");
        return this;
    }
}

export default GameObject;
