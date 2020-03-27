import GameObject from "./Object";

const speed = 6;

export class Player extends GameObject {
    constructor(game, x, y) {
        super(game, x, y, 30, 30);
        this.bindEvents();
        this.controls = {
            w: false,
            a: false,
            s: false,
            d: false            
        }
    }

    onKeyUP = async (keyboard) => {
        switch (keyboard.event.code) {
            case 'KeyA':
                this.controls.a = false;
                break;
            case 'KeyS':
                this.controls.s = false;
                break;
            case 'KeyD':
                this.controls.d = false;
                break;
            case 'KeyW':
                this.controls.w = false;
                break
        }
    };

    onKeyDown = async (keyboard) => {
        switch (keyboard.event.code) {
            case 'KeyA':
                this.controls.a = true;
                break;
            case 'KeyS':
                this.controls.s = true;
                break;
            case 'KeyD':
                this.controls.d = true;
                break;
            case 'KeyW':
                this.controls.w = true;
                break
        }
    };

    bindEvents() {
        this.game.input.keyboard.bind('keyup', this.onKeyUP);
        this.game.input.keyboard.bind('keydown', this.onKeyDown);
    }

    get moveVector() {
        return {
            x: this.controls.a * -speed + this.controls.d * speed,
            y: this.controls.w * -speed + this.controls.s * speed,
        }
    }

}