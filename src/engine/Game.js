import Input from "./Input";

class DebugConfig {
	defaultConfig = {
		debug: true,
		worldBorder: true,
		collisionBoxes: true,
		quadTree: true,
		objectLabels: true,
		hud: true,
	};

	constructor() {
		this.currentConfig = {};
	}

	update(config) {
		Object.keys(config).forEach(key => {
			this.currentConfig[key] = config[key];
		})
	}

	updateElem(elems) {
		Object.keys(elems).forEach(key => {
			this.currentConfig[key] = elems[key].checked;
		});
	}

	getValue(key) {
		return key in this.currentConfig ? this.currentConfig[key] : this.defaultConfig[key];
	}

	get debug() {
		return this.getValue('debug');
	}

	get hud() {
		return this.getValue('hud');
	}

	get worldBorder() {
		return this.getValue('worldBorder');
	}

	get collisionBoxes() {
		return this.getValue('collisionBoxes');
	}

	get quadTree() {
		return this.getValue('quadTree');
	}

	get objectLabels() {
		return this.getValue('objectLabels');
	}
}

export class Game {
    constructor(element, width, height) {
		this.canvas = element;
		this.width = width;
		this.height = height;
		this.input = new Input(this);
		this.ctx = this.canvas.getContext('2d');
		this.trackTransforms(this.ctx);
		this.loadedImages = {};
		this.lastDrawTimestamp = null;
		this.currentScene = null;
		this.scenes = [];
		this.initialize();

		this.debugConfig = new DebugConfig();
	}

    initialize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    addScene(scene) {
        this.scenes.push(scene);
        if (!this.currentScene) this.currentScene = scene;
    }

    async loadImage(image) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                resolve(img);
            }
        })
    }

    async loadImages(images) {
        return Promise.all(images.map(image => this.loadImage(image)));
    }

    async run(delta=0) {
        this.currentScene.update(delta);
        window.requestAnimationFrame(this.draw.bind(this));
    }

    async draw(timestamp) {
        if (!this.lastDrawTimestamp) this.lastDrawTimestamp = timestamp;
        const delta = timestamp - this.lastDrawTimestamp;
        this.lastDrawTimestamp = timestamp;

        this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.currentScene.draw(this.ctx, delta);
        this.ctx.restore();
        await this.run(delta);
    }

    trackTransforms(ctx){
		const svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		let xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };

		const savedTransforms = [];
		const save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		const restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		const scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		const rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		const translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		const transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			const m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		const setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		const pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
	}
}

export default Game;