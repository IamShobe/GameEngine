
export class Container {
    constructor(x, y, config={}) {
        const {alignW='left', alignH='top', direction='column', width = null, height = null, padding = 10} = config;
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.alignW = alignW;
        this.alignH = alignH;
        this.direction = direction;
        this.components = [];
        this.padding = padding;
    }

    getTransform(ctx) {
        let height = 0;
        let width = 0;
        this.components.forEach(comp => {
            const {w, h} = comp.getTransform(ctx);
            if(this.direction === "column") {
                height += h;
                width = Math.max(width, w)
            }
            if(this.direction === "row") {
                height = Math.max(height, h);
                width += w;
            }
        });
        return {
            w: (this.w || width) + this.padding * 2,
            h: (this.h || height) + this.padding * 2
        }
    }

    add(component) {
        this.components.push(component);
        return this;
    }

    addAll(components) {
        components.forEach(comp => this.add(comp));
        return this;
    }

    draw(ctx) {
        let posX = this.x;
        let posY = this.y;
        const {w, h} = this.getTransform(ctx);
        if(this.alignH === 'bottom') {
            posY -= h;
        }
        if(this.alignW === 'right') {
            posX -= w;
        }
        ctx.strokeStyle = "#ff29b3";

        ctx.strokeRect(posX, posY, w, h);
        posX += this.padding;
        posY += this.padding;
        this.components.forEach(comp => {
            comp.draw(ctx, posX, posY);
            const {w, h} = comp.getTransform(ctx);
            if(this.direction === 'column') posY += h;
            if(this.direction === 'row') posX += w;
        });
    }
}