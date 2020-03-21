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

    add(obj) {
        this.quad.add(obj);
    }

    draw(ctx, debugConfig) {
        if (!debugConfig.debug || !debugConfig.quadTree) return;
        this.quad.draw(ctx)
    }
}