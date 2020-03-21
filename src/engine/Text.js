export class Text {
    constructor(text, x = 0, y = 0, config = {}) {
        const {
            size = 20, alignW = 'left', alignH = 'top',
            fillColor = '#000', stroke = false, strokeColor = '#000',
            width = null, height = null
        } = config;

        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.alignW = alignW;
        this.alignH = alignH;
        this.fillColor = fillColor;
        this.stroke = stroke;
        this.strokeColor = strokeColor;
        this.width = width;
        this.height = height;
    }

    configure(ctx) {
        ctx.font = `900 ${this.size}px Georgia`;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
    }

    getTransform(ctx) {
        ctx.save();
        this.configure(ctx);
        const measure = ctx.measureText(this.text);
        ctx.restore();
        return {
            w: this.width || measure.width,
            h: this.height || this.size
        }
    }

    draw(ctx, offsetX, offsetY) {
        ctx.save();
        this.configure(ctx);
        const measure = ctx.measureText(this.text);
        let posX = this.x + offsetX;
        let posY = this.y + offsetY;

        if (this.alignH === 'top') {
            posY += this.height || this.size - this.size / 5;
        }
        if (this.alignW === 'right') {
            posX -= this.width || measure.width;
        }

        ctx.fillText(this.text, posX, posY);
        if (this.stroke) {
            ctx.strokeText(this.text, posX, posY);
        }
        ctx.restore();
    }
}