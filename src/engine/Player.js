import GameObject from "./Object";

const speed = 5;

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

    bindEvents() {
        this.game.input.keyboard.bind('keyup', (keyboard) => {
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
        });
        this.game.input.keyboard.bind('keydown', (keyboard) => {
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
        });
    }

    update(delta) {
        this.moveVector = {
          x: this.controls.a * -speed + this.controls.d * speed,
          y: this.controls.w * -speed + this.controls.s * speed,
        };
        super.update(delta);
    }

}