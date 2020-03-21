import * as matrix from 'transformation-matrix';

const ZOOM_FACTOR = 1.1;

export class Camera {
    constructor(game) {
        this.game = game;
        this.matrix = matrix.identity();
        this.dragStart = null;

        this.bindEvents();
    }

    bindEvents() {
        this.game.input.mouse.bind('dragStart', this.onDragStart);
        this.game.input.mouse.bind('dragStop', this.onDragStop);
        this.game.input.mouse.bind('drag', this.onDrag);
        this.game.input.mouse.bind('wheel', this.onWheel);
    }

    onDragStart = (mouse) => {
        const dragX = mouse.dragStart.x;
        const dragY = mouse.dragStart.y;
        this.dragStart = this.transformedPoint(dragX, dragY);
    };

    onDragStop = (mouse) => {
        this.dragStart = null;
    };

    onDrag = (mouse) => {
        const x = mouse.pos.x;
        const y = mouse.pos.y;
        const pt = this.transformedPoint(x, y);
        this.matrix = matrix.compose(
            this.matrix,
            matrix.translate(pt.x - this.dragStart.x, pt.y - this.dragStart.y)
        );
    };

    onWheel = (mouse) => {
        const x = mouse.pos.x;
        const y = mouse.pos.y;
        const amount = mouse.wheelDelta;
        const pt = this.transformedPoint(x, y);
        const factor = Math.pow(ZOOM_FACTOR, amount);
        this.matrix = matrix.compose(
            this.matrix,
            matrix.translate(pt.x, pt.y),
            matrix.scale(factor, factor),
            matrix.translate(-pt.x, -pt.y),
        );
    };

    get view() {
        const {a, e, f} = this.matrix;
        return {
            x: Math.round(e),
            y: Math.round(f),
            width: this.game.width,
            height: this.game.height,
            zoom: Math.round(a * 100) / 100
        }
    }

    getPoint(pt) {
        const toRet = this.transformedPoint(pt.x, pt.y);
        toRet.x = Math.round(toRet.x);
        toRet.y = Math.round(toRet.y);
        return toRet;
    }

    transformedPoint(x, y) {
        return matrix.applyToPoint(matrix.inverse(this.matrix), {x, y});
    }

    move(ctx) {
        const {a, d, e, f} = this.matrix;
        ctx.translate(e, f);
        ctx.scale(a, d)
    }

}

export default Camera;