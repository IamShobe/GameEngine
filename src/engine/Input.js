class InputType {
    get events() {
        return [];
    };

    constructor() {
        this._events = this.events.reduce((prev, curr) => {
            prev[curr] = [];
            return prev;
        }, {});
    }

    async emitEvent(event, evt) {
        const promises = this._events[event].map(callback => callback(this));
        await Promise.all(promises);
    }

    bind(event, callback) {
        this._events[event].push(callback);
    }
}

class Mouse extends InputType {
    get events() {
        return [
            'dragStart', 'dragStop', 'drag', 'wheel', 'up', 'move', 'down'
        ]
    }

    constructor() {
        super();
        this.pos = {
            x: 0,
            y: 0
        };
        this.isDragging = false;
        this.dragStart = null;
        this.wheelDelta = 0;
    }

}

class Keyboard extends InputType {
    get events() {
        return [
            'keydown', 'keyup'
        ]
    }

    constructor() {
        super();
        this.event = null;
    }
}

export class Input {
    constructor(game) {
        this.game = game;
        this.mouse = new Mouse();
        this.keyboard = new Keyboard();
        this.bindEvents();
    }

    setMousePos(evt) {
        this.mouse.pos.x = evt.offsetX || (evt.pageX - this.game.canvas.offsetLeft);
        this.mouse.pos.y = evt.offsetY || (evt.pageY - this.game.canvas.offsetTop);
    }

    onmousedown = async (evt) => {
        this.setMousePos(evt);
        this.mouse.isDragging = false;
        this.mouse.dragStart = {
            x: this.mouse.pos.x,
            y: this.mouse.pos.y
        };
        await Promise.all([
            this.mouse.emitEvent('dragStart', evt),
            this.mouse.emitEvent('down', evt)
        ])
    };

    onmousemove = async (evt) => {
        this.setMousePos(evt);
        this.mouse.isDragging = true;
        const promises = [];
        promises.push(this.mouse.emitEvent('move', evt));
        if (this.mouse.dragStart) {
            promises.push(this.mouse.emitEvent('drag', evt));
        }
        await Promise.all(promises);
    };

    onmouseup = async (evt) => {
        this.mouse.isDragging = false;
        this.mouse.dragStart = null;
        await Promise.all([
            this.mouse.emitEvent('dragStop', evt),
            this.mouse.emitEvent('up', evt)
        ])
    };

    onmousewheel = async (evt) => {
        this.mouse.wheelDelta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        await this.mouse.emitEvent('wheel', evt);
    };

    onkeydown = async (evt) => {
        this.keyboard.event = evt;
        await this.keyboard.emitEvent('keydown', evt);
    };
    onkeyup = async (evt) => {
        this.keyboard.event = evt;
        await this.keyboard.emitEvent('keyup', evt);
    };

    bindEvents() {
        this.game.canvas.addEventListener('mousedown', this.onmousedown);
        this.game.canvas.addEventListener('mousemove', this.onmousemove);
        this.game.canvas.addEventListener('mouseup', this.onmouseup);
        this.game.canvas.addEventListener('mousewheel', this.onmousewheel);
        document.addEventListener('keydown', this.onkeydown);
        document.addEventListener('keyup', this.onkeyup);
    }

}

export default Input;
