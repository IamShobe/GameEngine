import _ from 'lodash';
import {RectCollision} from "./CollisionBox";

const MAX_IN_QUAD = 4;

class Quad extends RectCollision {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.objects = [];
        this.quads = [];
    }

    get isLeaf() {
        return this.quads.length === 0;
    }

    addToQuad(obj) {
        this.quads.forEach(quad => {
            if(obj.collision.isInQuad(quad)) {
                quad.add(obj);
            }
        });
    }

    isInside(x, y) {
        return (
            (x >= this.x && x <= (this.x + this.width))
            &&
            (y >= this.y && y <= (this.y + this.height))
        )
    }

    isEmpty(x, y) {
        if(!this.isInside(x, y)) {
            return true;
        }

        if(!this.isLeaf) {
            const xPositions = [this.x, this.x + this.width / 2, this.x + this.width];
            const yPositions = [this.y, this.y + this.height / 2, this.y + this.height];
            const xQuad = _.sortedIndex(xPositions, x);  // should be either 1 or 2
            const yQuad = _.sortedIndex(yPositions, y);  // should be either 1 or 2

            let quadIndex = undefined;
            if (xQuad === 1 && yQuad === 1) {
                quadIndex = 0;
            } else if (xQuad === 2 && yQuad === 1) {
                quadIndex = 1;
            } else if (xQuad === 1 && yQuad === 2) {
                quadIndex = 2;
            } else if (xQuad === 2 && yQuad === 2) {
                quadIndex = 3
            }
            return this.quads[quadIndex].isEmpty(x, y);
        }
        return !this.objects.some(obj => obj.pointCollides(x, y));
    }

    add(obj) {
        this.objects.push(obj);
        if (this.isLeaf && this.objects.length === MAX_IN_QUAD) {
            this.quads = [
                new Quad(this.x, this.y, this.width / 2, this.height / 2),
                new Quad(this.x + this.width / 2, this.y, this.width / 2, this.height / 2),
                new Quad(this.x, this.y + this.height / 2, this.width / 2, this.height / 2),
                new Quad(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2),
            ];
            this.objects.forEach(obj => this.addToQuad(obj));
        }
        else if (!this.isLeaf) {
            this.addToQuad(obj);
        }
        return this;
    }

    remove(obj) {
        _.remove(this.objects, o => o === obj);
        this.quads.forEach(q => {
            if (q.objects.includes(obj)) q.remove(obj);
        });
    }


    draw(ctx) {
        ctx.strokeStyle = "#5bff39";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.quads.forEach(quad => quad.draw(ctx));
    }
}

export class CollisionSpace {
    constructor(scene) {
        this.width = scene.width;
        this.height = scene.height;
        this.quad = new Quad(0, 0, this.width, this.height);
    }

    getPotentialQuads(obj) {
        const aux = (quad, obj) => {
            let toRet = [];
            if (quad.isLeaf && quad.objects.includes(obj)) {
                return [quad];
            }

            if (!quad.isLeaf && quad.objects.includes(obj)) {
                toRet = quad.quads.map(q => aux(q, obj)).flat();
            }
            return toRet;
        };
        return aux(this.quad, obj);
    }

    getPotentialCollisions(obj) {
        const quads = this.getPotentialQuads(obj);
        const objects = _.uniqBy(quads.map(quad => quad.objects).flat(), 'id');
        _.remove(objects, (o) => o === obj);
        return objects;
    }

    isEmpty(x, y) {
        return this.quad.isEmpty(x, y);
    }

    add(obj) {
        this.quad.add(obj);
    }

    remove(obj) {
        this.quad.remove(obj);
    }

    update(obj) {
        this.quad.remove(obj);
        this.quad.add(obj);
    }

    draw(ctx, debugConfig) {
        if (!debugConfig.debug || !debugConfig.quadTree) return;
        this.quad.draw(ctx)
    }
}