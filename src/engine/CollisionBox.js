export class Collision {
    constructor() {
        this.transform = {};
        this.transformStack = [];
    }

    save() {
        this.transformStack.push({...this.transform});
    }

    restore() {
        this.transform = this.transformStack.pop();
    }

    commit() {
        this.transformStack.pop();
    }

    collides(x, y) {
        return false;
    }

    otherCollides(collision, recursed=false) {
        return false;
    }

    isInQuad(quad) {
        return false
    }

    newFromAdvancement(props) {
        return new Collision();
    }

    getYOfX(x, side) {
        return 0;
    }

    getXOfY(y, side) {
        return 0;
    }

    rectCollides(collision) {
        const topLeft = {x: collision.x, y: collision.y};
        const topRight = {x: collision.x + collision.width, y: collision.y};
        const bottomLeft = {x: collision.x, y: collision.y + collision.height};
        const bottomRight = {x: collision.x + collision.width, y: collision.y + collision.height};


        return [topLeft, topRight, bottomRight, bottomLeft].some(point => this.collides(point.x, point.y));
    }

    draw(ctx) {
        ctx.strokeStyle = "#FF0000";
    }
}

export class RectCollision extends Collision {
    constructor(x, y, w, h) {
        super();
        this.transform = {x, y, w, h};
    }

    get width() {
        return this.transform.w;
    }

    get height() {
        return this.transform.h;
    }

    get x() {
        return this.transform.x;
    }

    get y() {
        return this.transform.y;
    }

    getXOfY(y, side) {
        switch (side) {
            case "left":
                return this.x;
            case "right":
                return this.x + this.width;
        }
    }

    getYOfX(x, side) {
        switch (side) {
            case "top":
                return this.y;
            case "bottom":
                return this.y + this.height;
        }
    }

    isInQuad(quad) {
        return quad.rectCollides(this) || this.rectCollides(quad);
    }

    otherCollides(collision, recurse=false) {
        return collision.rectCollides(this) || !recurse && collision.otherCollides(this, true);
    }

    newFromAdvancement({x, y}) {
        return new RectCollision(this.transform.x + x, this.transform.y + y, this.transform.w, this.transform.h);
    }

    collides(x, y) {
        return (
            ((x > this.transform.x) && (x < (this.transform.x + this.transform.w)))
            &&
            ((y > this.transform.y) && (y < (this.transform.y + this.transform.h)))
        )
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        ctx.strokeRect(this.transform.x, this.transform.y, this.transform.w, this.transform.h);
        ctx.restore();
    }
}

export class CircleCollision extends Collision {
    constructor(x, y, r) {
        super();
        this.x = x;
        this.y = y;
        this.r = r;
    }

    collides(x, y) {
        return (
            Math.sqrt(
                (
                    Math.pow(x - this.x, 2)
                    +
                    Math.pow(y - this.y, 2)
                )
            ) < this.r
        )
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}